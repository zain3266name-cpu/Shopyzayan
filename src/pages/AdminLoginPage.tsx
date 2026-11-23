import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { STORE_CONFIG } from '../config/storeConfig';
import { SUPABASE_PUBLIC_CONFIG } from '../config/supabaseConfig';
import { useStore } from '../context/StoreContext';
import { checkAdminConfigStatus } from '../services/adminAuthService';

export function AdminLoginPage() {
  const { adminAuth, loginAdmin, navigate, showToast } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isCheckingConfig, setIsCheckingConfig] = useState(true);
  const [configStatus, setConfigStatus] = useState<{
    configured: boolean;
    projectId?: string;
    reason?: string;
  }>({
    configured: false,
  });

  useEffect(() => {
    let active = true;
    checkAdminConfigStatus()
      .then((status) => {
        if (active) {
          setConfigStatus(status);
          setIsCheckingConfig(false);
        }
      })
      .catch(() => {
        if (active) {
          setConfigStatus({
            configured: false,
            reason: 'Secure admin authentication is not configured yet.',
          });
          setIsCheckingConfig(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (adminAuth.status === 'authenticated' && adminAuth.user) {
      navigate('admin');
    }
  }, [adminAuth.status, adminAuth.user, navigate]);

  const isSubmitting = adminAuth.status === 'checking';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!configStatus.configured) {
      setFormError(
        configStatus.reason ||
          'Secure admin authentication is not configured yet. Access to the admin dashboard is disabled.'
      );
      return;
    }

    if (!email.trim() || !password) {
      setFormError('Please enter both your administrator email and password.');
      return;
    }

    const result = await loginAdmin(email, password);
    if (result.ok) {
      setSuccessMessage('Authentication and admin role verified. Redirecting to dashboard...');
      window.setTimeout(() => {
        navigate('admin');
      }, 400);
    } else {
      setFormError(result.message || 'Access denied.');
    }
  };

  const activeError = formError || adminAuth.errorMessage;
  const needsAdminTableSetup = Boolean(
    activeError && activeError.toLowerCase().includes('public.admin_users')
  );
  const targetEmailForSql = (email.trim() || 'your-admin-email@gmail.com').replace(/'/g, "''");
  const quickSetupSql = [
    `create table if not exists public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade, email text not null unique, role text not null default 'admin', is_active boolean not null default true, created_at timestamptz not null default now());`,
    `alter table public.admin_users enable row level security;`,
    `drop policy if exists "Admins can read own active record" on public.admin_users;`,
    `create policy "Admins can read own active record" on public.admin_users for select to authenticated using (auth.uid() = user_id and is_active = true);`,
    `insert into public.admin_users (user_id, email, role, is_active) select id, email, 'super_admin', true from auth.users where email = '${targetEmailForSql}' on conflict (user_id) do update set is_active = true, role = 'super_admin';`,
  ].join('\n');

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(quickSetupSql);
      setCopiedSql(true);
      showToast('SQL copied', 'Clear any old text in SQL Editor, paste, and tap Run.');
      window.setTimeout(() => setCopiedSql(false), 2500);
    } catch {
      showToast('Copy failed', 'Please select and copy the SQL text manually.', 'error');
    }
  };

  return (
    <div className="min-h-[72vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="w-full max-w-md space-y-6">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5C577A] dark:text-[#B8B3D1] hover:text-[#713BDB] dark:hover:text-[#A78BFA] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {STORE_CONFIG.brandName} Storefront</span>
        </button>

        <div className="rounded-2xl border border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] shadow-lg overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#713BDB] via-[#FF626E] to-[#FFC83D]" />

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#F8F6FF] dark:bg-[#26223D] border border-[#713BDB]/20 dark:border-white/10 flex items-center justify-center text-[#713BDB] dark:text-[#A78BFA] shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.12em] font-bold text-[#713BDB] dark:text-[#A78BFA]">
                  Restricted Staff Portal
                </p>
                <h1 className="font-display text-2xl font-bold text-[#24213A] dark:text-[#F4F2FF] mt-0.5">
                  {STORE_CONFIG.brandName} Admin Sign In
                </h1>
              </div>
            </div>

            {!isCheckingConfig && configStatus.configured && (
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-[#F4FBF7] dark:bg-emerald-950/30 px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700 dark:text-emerald-300" />
                <span>
                  Connected to Supabase Auth
                  {configStatus.projectId ? ` (${configStatus.projectId})` : ''} · Verified against{' '}
                  <span className="font-mono font-semibold">public.admin_users</span>
                </span>
              </div>
            )}

            {!isCheckingConfig && !configStatus.configured && (
              <div
                role="alert"
                className="rounded-xl border border-amber-300/70 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 p-4 flex items-start gap-3 text-xs leading-relaxed text-amber-900 dark:text-amber-200"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div className="space-y-1">
                  <p className="font-bold">Secure admin authentication is not configured yet.</p>
                  <p className="opacity-90">
                    Connect Supabase Authentication (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
                    server-side verification key, and the RLS-protected `admin_users` table) before
                    admin access can be granted.
                  </p>
                </div>
              </div>
            )}

            {activeError && (
              <div
                role="alert"
                className="rounded-xl border border-[#FF626E]/40 bg-[#FFF0F2] dark:bg-[#FF626E]/10 p-3.5 space-y-3 text-xs text-[#B4232F] dark:text-[#FF8E97]"
              >
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">{activeError}</p>
                </div>

                {needsAdminTableSetup && (
                  <div className="pt-2 border-t border-[#FF626E]/25 space-y-2.5 text-[#24213A] dark:text-[#F4F2FF]">
                    <p className="text-[11px] font-semibold">
                      One-time Supabase setup: Copy SQL below, clear any old text in SQL Editor,
                      paste it, and tap Run.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleCopySql}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#713BDB] text-white text-[11px] font-semibold hover:bg-[#5E2EC4] transition-colors"
                      >
                        {copiedSql ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>SQL Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Setup SQL</span>
                          </>
                        )}
                      </button>

                      <a
                        href={`https://supabase.com/dashboard/project/${
                          configStatus.projectId || SUPABASE_PUBLIC_CONFIG.projectId
                        }/sql/new`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#26223D] border border-[#713BDB]/25 dark:border-white/15 text-[11px] font-semibold text-[#24213A] dark:text-[#F4F2FF] hover:border-[#713BDB]"
                      >
                        <span>Open Supabase SQL Editor</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {successMessage && (
              <div
                role="status"
                className="rounded-xl border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 p-3.5 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-semibold text-[#24213A] dark:text-[#F4F2FF] mb-1.5"
                >
                  Admin Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="admin@shopzayn.pk"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#713BDB]/20 dark:border-white/15 bg-[#F8F6FF] dark:bg-[#26223D] text-[#24213A] dark:text-[#F4F2FF] placeholder:text-[#8E89A8] focus:bg-white dark:focus:bg-[#2D2847] focus:outline-none focus:border-[#713BDB]"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-[#24213A] dark:text-[#F4F2FF] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="Enter your password"
                    className="w-full pl-3.5 pr-11 py-2.5 text-sm rounded-xl border border-[#713BDB]/20 dark:border-white/15 bg-[#F8F6FF] dark:bg-[#26223D] text-[#24213A] dark:text-[#F4F2FF] placeholder:text-[#8E89A8] focus:bg-white dark:focus:bg-[#2D2847] focus:outline-none focus:border-[#713BDB]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#5C577A] dark:text-[#B8B3D1] hover:text-[#713BDB] dark:hover:text-[#A78BFA] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isCheckingConfig || !configStatus.configured}
                className="w-full py-3.5 px-5 bg-[#713BDB] text-white text-sm font-semibold rounded-xl hover:bg-[#5E2EC4] disabled:opacity-55 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Authorization...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In to Admin Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-[#713BDB]/10 dark:border-white/10 text-[11px] text-[#6B6589] dark:text-[#9892B8] space-y-1">
              <p className="font-semibold text-[#24213A] dark:text-[#F4F2FF]">
                Two-Step Security Enforcement
              </p>
              <p>
                Access requires valid Supabase Authentication plus an active administrator record in{' '}
                <span className="font-mono">public.admin_users</span> verified on the server and
                enforced by Row Level Security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
