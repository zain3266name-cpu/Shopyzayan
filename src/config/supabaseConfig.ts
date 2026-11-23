/**
 * Public Supabase client configuration.
 * Only the Project URL and public Publishable Key belong here — never add any
 * service_role or sb_secret_* key to frontend code. Security is enforced by
 * Supabase Authentication, server-side JWT checks, and Row Level Security (RLS).
 */
export const SUPABASE_PUBLIC_CONFIG = {
  projectId: 'gyvpmqiskoaxihmanrbc',
  url: (import.meta.env?.VITE_SUPABASE_URL || 'https://gyvpmqiskoaxihmanrbc.supabase.co').trim(),
  publishableKey: (
    import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_aTPf6-QHiO4a6g6YAf4sIA_hLT1PbT2'
  ).trim(),
} as const;
