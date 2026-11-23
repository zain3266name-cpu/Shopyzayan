import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_PUBLIC_CONFIG } from '../config/supabaseConfig';
import { AdminUserProfile } from '../types/store';

export type AdminAuthErrorCode =
  | 'NOT_CONFIGURED'
  | 'AUTH_FAILED'
  | 'FORBIDDEN'
  | 'NETWORK_ERROR';

export type AdminVerificationResult =
  | {
      ok: true;
      admin: AdminUserProfile;
      accessToken: string;
    }
  | {
      ok: false;
      code: AdminAuthErrorCode;
      message: string;
    };

let cachedClient: SupabaseClient | null = null;

function readClientConfig(): { url: string; publishableKey: string } {
  return {
    url: SUPABASE_PUBLIC_CONFIG.url,
    publishableKey: SUPABASE_PUBLIC_CONFIG.publishableKey,
  };
}

export function isClientSupabaseConfigured(): boolean {
  const { url, publishableKey } = readClientConfig();
  if (!url || !publishableKey) return false;
  if (
    url.includes('MY_') ||
    url.includes('YOUR_') ||
    publishableKey.includes('MY_') ||
    publishableKey.includes('YOUR_')
  ) {
    return false;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function getSupabaseClient(): SupabaseClient | null {
  if (!isClientSupabaseConfigured()) return null;
  if (!cachedClient) {
    const { url, publishableKey } = readClientConfig();
    cachedClient = createClient(url, publishableKey, {
      auth: {
        // Keep admin tokens strictly in React memory (never localStorage or sessionStorage)
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return cachedClient;
}

export async function checkAdminConfigStatus(): Promise<{
  configured: boolean;
  projectId?: string;
  reason?: string;
}> {
  if (!isClientSupabaseConfigured()) {
    return {
      configured: false,
      reason:
        'Secure admin authentication is not configured yet. Configure Supabase environment credentials and RLS policies before signing in.',
    };
  }

  try {
    const res = await fetch('/api/admin/config-status', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = (await res.json()) as {
        supabaseServerConfigured?: boolean;
        projectId?: string;
      };
      if (!data.supabaseServerConfigured) {
        return {
          configured: false,
          reason:
            'Secure admin authentication is not configured yet on the server. Set Supabase verification credentials to enable admin access.',
        };
      }
      return {
        configured: true,
        projectId: data.projectId || SUPABASE_PUBLIC_CONFIG.projectId,
      };
    }
  } catch {
    // Static hosting fallback: client-side Supabase Auth + RLS verification still applies
  }

  return {
    configured: true,
    projectId: SUPABASE_PUBLIC_CONFIG.projectId,
  };
}

async function verifyAuthorizationViaServerOrRls(
  client: SupabaseClient,
  userId: string,
  accessToken: string
): Promise<AdminVerificationResult> {
  try {
    const res = await fetch('/api/admin/session', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const payload = (await res.json()) as {
        authorized?: boolean;
        admin?: AdminUserProfile;
        error?: string;
        code?: string;
      };

      if (res.ok && payload.authorized && payload.admin) {
        return {
          ok: true,
          admin: payload.admin,
          accessToken,
        };
      }

      await client.auth.signOut().catch(() => {});

      if (res.status === 503 || payload.code === 'NOT_CONFIGURED') {
        return {
          ok: false,
          code: 'NOT_CONFIGURED',
          message: payload.error || 'Secure admin authentication is not configured yet.',
        };
      }

      return {
        ok: false,
        code: res.status === 401 ? 'AUTH_FAILED' : 'FORBIDDEN',
        message:
          payload.error ||
          'Access denied. Your account is authenticated, but it is not authorized as an administrator.',
      };
    }
  } catch {
    // Fall through to strict RLS check if backend route is unavailable on static hosting
  }

  // Static deployment fallback: create a bearer-scoped request to public.admin_users
  // Protected strictly by Supabase Row Level Security (auth.uid() = user_id AND is_active = true)
  const { url, publishableKey } = readClientConfig();
  const scopedClient = createClient(url, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  const { data: adminRow, error: rlsError } = await scopedClient
    .from('admin_users')
    .select('user_id, email, role, is_active')
    .eq('user_id', userId)
    .eq('is_active', true)
    .maybeSingle();

  if (rlsError) {
    await client.auth.signOut().catch(() => {});
    const isMissingTable =
      rlsError.code === 'PGRST205' ||
      rlsError.code === '42P01' ||
      rlsError.message?.includes('admin_users');
    return {
      ok: false,
      code: 'FORBIDDEN',
      message: isMissingTable
        ? 'The public.admin_users authorization table is not set up in Supabase yet. Run supabase/schema.sql in your Supabase SQL Editor first.'
        : 'Access denied. Unable to verify admin permissions in public.admin_users.',
    };
  }

  if (!adminRow) {
    await client.auth.signOut().catch(() => {});
    return {
      ok: false,
      code: 'FORBIDDEN',
      message:
        'Access denied. Your Gmail/password is valid, but this account is not added as an active admin in public.admin_users.',
    };
  }

  return {
    ok: true,
    admin: {
      id: String(adminRow.user_id),
      email: String(adminRow.email || ''),
      role: String(adminRow.role || 'admin'),
    },
    accessToken,
  };
}

export async function signInAndVerifyAdmin(
  email: string,
  password: string
): Promise<AdminVerificationResult> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      ok: false,
      code: 'NOT_CONFIGURED',
      message:
        'Secure admin authentication is not configured yet. Please configure Supabase credentials before signing in.',
    };
  }

  const normalizedEmail = email.trim();
  if (!normalizedEmail || !password) {
    return {
      ok: false,
      code: 'AUTH_FAILED',
      message: 'Please enter both your email address and password.',
    };
  }

  const { data, error } = await client.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error || !data.session?.access_token || !data.user) {
    await client.auth.signOut().catch(() => {});
    return {
      ok: false,
      code: 'AUTH_FAILED',
      message: error?.message || 'Authentication failed. Please check your email and password.',
    };
  }

  return verifyAuthorizationViaServerOrRls(client, data.user.id, data.session.access_token);
}

export async function verifyExistingAdminSession(
  accessToken: string
): Promise<AdminVerificationResult> {
  const client = getSupabaseClient();
  if (!client || !accessToken) {
    return {
      ok: false,
      code: 'NOT_CONFIGURED',
      message: 'Secure admin authentication is not configured yet.',
    };
  }

  const { data, error } = await client.auth.getUser(accessToken);
  if (error || !data.user) {
    return {
      ok: false,
      code: 'AUTH_FAILED',
      message: 'Your admin session has expired. Please sign in again.',
    };
  }

  return verifyAuthorizationViaServerOrRls(client, data.user.id, accessToken);
}

export async function signOutAdmin(): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    await client.auth.signOut().catch(() => {});
  }
}
