import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_PROJECT_ID = 'gyvpmqiskoaxihmanrbc';
const DEFAULT_SUPABASE_URL = `https://${DEFAULT_PROJECT_ID}.supabase.co`;
const DEFAULT_PUBLISHABLE_KEY = 'sb_publishable_aTPf6-QHiO4a6g6YAf4sIA_hLT1PbT2';

interface VerifiedAdmin {
  id: string;
  email: string;
  role: string;
}

interface AdminAuthenticatedRequest extends express.Request {
  adminUser?: VerifiedAdmin;
}

function getSupabaseServerConfig() {
  const url = (
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    DEFAULT_SUPABASE_URL
  ).trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const publishableKey = (
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    DEFAULT_PUBLISHABLE_KEY
  ).trim();

  const hasUrl = Boolean(url && !url.includes('YOUR_') && !url.includes('MY_'));
  const hasServiceKey = Boolean(
    serviceRoleKey && !serviceRoleKey.includes('YOUR_') && !serviceRoleKey.includes('MY_')
  );
  const hasPublishableKey = Boolean(
    publishableKey && !publishableKey.includes('YOUR_') && !publishableKey.includes('MY_')
  );

  if (!hasUrl || (!hasServiceKey && !hasPublishableKey)) {
    return null;
  }

  return {
    url,
    serviceRoleKey: hasServiceKey ? serviceRoleKey : null,
    publishableKey: hasPublishableKey ? publishableKey : null,
  };
}

function createScopedSupabaseClient(url: string, key: string, accessToken?: string) {
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    ...(accessToken
      ? {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        }
      : {}),
  });
}

async function requireAdmin(
  req: AdminAuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction
) {
  const cfg = getSupabaseServerConfig();
  if (!cfg) {
    res.status(503).json({
      error: 'Secure admin authentication is not configured yet on the server.',
      code: 'NOT_CONFIGURED',
    });
    return;
  }

  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  const accessToken = match?.[1]?.trim();

  if (!accessToken) {
    res.status(401).json({
      error: 'Authentication required. Please sign in with an authorized admin account.',
      code: 'UNAUTHENTICATED',
    });
    return;
  }

  try {
    // Prefer service_role if configured; otherwise verify the caller's JWT and query under RLS
    const authClient = createScopedSupabaseClient(
      cfg.url,
      cfg.serviceRoleKey || cfg.publishableKey!
    );

    const { data: userData, error: userError } = await authClient.auth.getUser(accessToken);

    if (userError || !userData?.user) {
      res.status(401).json({
        error: 'Invalid or expired authentication session.',
        code: 'INVALID_TOKEN',
      });
      return;
    }

    const dbClient = cfg.serviceRoleKey
      ? authClient
      : createScopedSupabaseClient(cfg.url, cfg.publishableKey!, accessToken);

    const { data: adminRecord, error: adminError } = await dbClient
      .from('admin_users')
      .select('user_id, email, role, is_active')
      .eq('user_id', userData.user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (adminError) {
      const missingTable =
        adminError.code === 'PGRST205' ||
        adminError.code === '42P01' ||
        adminError.message?.includes('admin_users');
      res.status(403).json({
        error: missingTable
          ? 'The public.admin_users authorization table is not created in Supabase yet. Run supabase/schema.sql in your Supabase SQL Editor first.'
          : 'Admin authorization check failed. Ensure Supabase RLS and admin_users are configured.',
        code: 'AUTHORIZATION_CHECK_FAILED',
      });
      return;
    }

    if (!adminRecord) {
      res.status(403).json({
        error:
          'Access denied. Your email and password are valid, but this account is not authorized in public.admin_users.',
        code: 'FORBIDDEN',
      });
      return;
    }

    req.adminUser = {
      id: adminRecord.user_id,
      email: adminRecord.email || userData.user.email || '',
      role: adminRecord.role || 'admin',
    };

    next();
  } catch {
    res.status(500).json({
      error: 'Unable to verify admin authorization at this time.',
      code: 'SERVER_ERROR',
    });
  }
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.disable('x-powered-by');
  app.use(express.json({ limit: '256kb' }));

  // Public health/configuration status endpoint (never exposes secrets)
  app.get('/api/admin/config-status', (_req, res) => {
    const cfg = getSupabaseServerConfig();
    res.json({
      supabaseServerConfigured: Boolean(cfg),
      projectId: DEFAULT_PROJECT_ID,
    });
  });

  // Protected admin session verification endpoint
  app.get('/api/admin/session', requireAdmin, (req: AdminAuthenticatedRequest, res) => {
    res.json({
      authorized: true,
      admin: req.adminUser,
    });
  });

  // Protected admin integration structure overview endpoint
  app.get('/api/admin/overview', requireAdmin, (req: AdminAuthenticatedRequest, res) => {
    res.json({
      authorized: true,
      mode: 'ui-integration-structure',
      admin: req.adminUser,
      sections: ['overview', 'products', 'orders', 'categories', 'inventory', 'settings'],
    });
  });

  // Reject any unknown /api/* route with JSON 404
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API route not found' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ShopZayn server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start ShopZayn server:', err);
  process.exit(1);
});
