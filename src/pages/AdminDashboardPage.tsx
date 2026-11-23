import {
  AlertCircle,
  ArrowLeft,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Database,
  FolderTree,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Moon,
  Package,
  Settings,
  ShieldCheck,
  Sun,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ProductImage } from '../components/ProductImage';
import { formatPkr, STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { catalogService } from '../services/catalogService';
import { AdminSection } from '../types/store';

const NAV_SECTIONS: Array<{
  id: AdminSection;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function AdminDashboardPage() {
  const {
    adminAuth,
    verifyAdminSession,
    logoutAdmin,
    navigate,
    theme,
    toggleTheme,
    showToast,
  } = useStore();

  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const catalogProducts = useMemo(() => catalogService.getAllProducts(), []);
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const product of catalogProducts) {
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
  }, [catalogProducts]);

  // Continuously verify server-side authorization when entering dashboard
  useEffect(() => {
    let active = true;
    verifyAdminSession().then((valid) => {
      if (active && !valid) {
        navigate('admin-login');
      }
    });
    return () => {
      active = false;
    };
  }, [verifyAdminSession, navigate]);

  // Fail closed: never render dashboard content unless verified in-memory
  if (adminAuth.status !== 'authenticated' || !adminAuth.user || !adminAuth.accessToken) {
    return null;
  }

  const handlePreviewOnlyNotice = (actionLabel: string) => {
    showToast(
      'Database not connected yet',
      `${actionLabel} will activate once Supabase tables & RLS policies are connected.`,
      'info'
    );
  };

  return (
    <div className="min-h-screen flex bg-[#F8F6FF] dark:bg-[#12101F] text-[#24213A] dark:text-[#F4F2FF]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] shrink-0">
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#713BDB]/10 dark:border-white/10">
          <button
            type="button"
            onClick={() => setActiveSection('overview')}
            className="font-display text-xl font-bold bg-gradient-to-r from-[#713BDB] to-[#FF626E] dark:from-[#A78BFA] dark:to-[#FF626E] bg-clip-text text-transparent"
          >
            {STORE_CONFIG.brandName} Admin
          </button>
          <span className="px-2 py-0.5 rounded-md bg-[#F8F6FF] dark:bg-[#26223D] text-[10px] font-mono font-bold text-[#713BDB] dark:text-[#A78BFA]">
            RLS
          </span>
        </div>

        <nav aria-label="Admin sections" className="flex-1 p-4 space-y-1.5">
          {NAV_SECTIONS.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-[#713BDB] text-white shadow-xs'
                    : 'text-[#5C577A] dark:text-[#B8B3D1] hover:bg-[#F8F6FF] dark:hover:bg-[#26223D] hover:text-[#24213A] dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#713BDB]/10 dark:border-white/10 space-y-2.5">
          <div className="px-3 py-2.5 rounded-xl bg-[#F8F6FF] dark:bg-[#26223D] text-xs space-y-0.5">
            <p className="font-bold text-[#24213A] dark:text-[#F4F2FF] truncate">
              {adminAuth.user.email}
            </p>
            <p className="text-[11px] uppercase tracking-wider font-mono text-[#713BDB] dark:text-[#A78BFA]">
              Role: {adminAuth.user.role}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('home')}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#5C577A] dark:text-[#B8B3D1] hover:bg-[#F8F6FF] dark:hover:bg-[#26223D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Public Storefront</span>
          </button>

          <button
            type="button"
            onClick={() => {
              void logoutAdmin();
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#FF626E] hover:bg-[#FFF0F2] dark:hover:bg-[#FF626E]/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-[#713BDB]/15 dark:border-white/10 bg-white/95 dark:bg-[#1C192E]/95 backdrop-blur-md flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label="Toggle admin menu"
              className="lg:hidden p-2 rounded-xl border border-[#713BDB]/15 dark:border-white/10 text-[#24213A] dark:text-[#F4F2FF]"
            >
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div>
              <h1 className="font-display text-lg sm:text-xl font-bold text-[#24213A] dark:text-[#F4F2FF] capitalize">
                {activeSection === 'overview' ? 'Dashboard Overview' : activeSection}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Supabase Verified</span>
            </span>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl border border-[#713BDB]/15 dark:border-white/10 text-[#24213A] dark:text-[#FFC83D] hover:bg-[#F8F6FF] dark:hover:bg-[#26223D] transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => navigate('home')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#713BDB]/15 dark:border-white/10 text-xs font-semibold hover:border-[#713BDB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>

            <button
              type="button"
              onClick={() => {
                void logoutAdmin();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFF0F2] dark:bg-[#FF626E]/15 text-[#FF626E] text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Mobile Section Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden border-b border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {NAV_SECTIONS.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-[#713BDB] text-white'
                      : 'bg-[#F8F6FF] dark:bg-[#26223D] text-[#24213A] dark:text-[#F4F2FF]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1320px] w-full mx-auto space-y-6">
          {/* UI & Integration Structure Notice */}
          <div className="rounded-2xl border border-[#713BDB]/20 dark:border-white/10 bg-white dark:bg-[#1C192E] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-[#713BDB] dark:text-[#A78BFA] shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-[#24213A] dark:text-[#F4F2FF]">
                  Integration Structure Preview (Read-Only UI)
                </p>
                <p className="text-[#5C577A] dark:text-[#B8B3D1]">
                  Admin authentication and route access are protected via Supabase & server-side{' '}
                  <span className="font-mono">admin_users</span> verification. Product, category,
                  and order tables are ready to connect to live Supabase Postgres & RLS policies.
                </p>
              </div>
            </div>
          </div>

          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] p-5 space-y-2 shadow-xs">
                  <p className="text-xs font-semibold text-[#5C577A] dark:text-[#B8B3D1]">
                    Storefront Catalog Items
                  </p>
                  <p className="font-display text-3xl font-bold tabular-nums text-[#713BDB] dark:text-[#A78BFA]">
                    {catalogProducts.length}
                  </p>
                  <p className="text-[11px] text-[#6B6589] dark:text-[#9892B8]">
                    Currently served from local catalog module
                  </p>
                </div>

                <div className="rounded-2xl border border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] p-5 space-y-2 shadow-xs">
                  <p className="text-xs font-semibold text-[#5C577A] dark:text-[#B8B3D1]">
                    Active Categories
                  </p>
                  <p className="font-display text-3xl font-bold tabular-nums text-[#FF626E]">
                    {categories.length}
                  </p>
                  <p className="text-[11px] text-[#6B6589] dark:text-[#9892B8]">
                    Apparel, Watches, Leather, Fragrances, Living
                  </p>
                </div>

                <div className="rounded-2xl border border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] p-5 space-y-2 shadow-xs">
                  <p className="text-xs font-semibold text-[#5C577A] dark:text-[#B8B3D1]">
                    Live DB Orders
                  </p>
                  <p className="font-display text-3xl font-bold tabular-nums text-[#0E7490] dark:text-[#28C5D7]">
                    —
                  </p>
                  <p className="text-[11px] text-[#6B6589] dark:text-[#9892B8]">
                    Connect <span className="font-mono">public.orders</span> table to sync
                  </p>
                </div>

                <div className="rounded-2xl border border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] p-5 space-y-2 shadow-xs">
                  <p className="text-xs font-semibold text-[#5C577A] dark:text-[#B8B3D1]">
                    Authorization Guard
                  </p>
                  <p className="font-display text-2xl font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    <span>Enforced</span>
                  </p>
                  <p className="text-[11px] text-[#6B6589] dark:text-[#9892B8]">
                    Supabase JWT + <span className="font-mono">admin_users</span> RLS
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 rounded-2xl border border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] p-6 space-y-4 shadow-xs">
                  <h2 className="font-display text-lg font-bold">Supabase Integration Readiness</h2>
                  <ul className="divide-y divide-[#713BDB]/10 dark:divide-white/10 text-sm">
                    {[
                      {
                        label: 'Supabase Auth & Explicit Admin Table (admin_users)',
                        status: 'Verified Session',
                        ready: true,
                      },
                      {
                        label: 'Server-Side Route Guard (/api/admin/*)',
                        status: 'Active',
                        ready: true,
                      },
                      {
                        label: 'Products & Inventory Table Sync (public.products)',
                        status: 'Schema Ready (UI Preview)',
                        ready: false,
                      },
                      {
                        label: 'COD & WhatsApp Order Persistence (public.orders)',
                        status: 'Schema Ready (UI Preview)',
                        ready: false,
                      },
                    ].map((row) => (
                      <li key={row.label} className="py-3 flex items-center justify-between gap-4">
                        <span className="text-[#24213A] dark:text-[#F4F2FF] font-medium">
                          {row.label}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 ${
                            row.ready
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                              : 'bg-[#F8F6FF] dark:bg-[#26223D] text-[#5C577A] dark:text-[#B8B3D1]'
                          }`}
                        >
                          {row.ready ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5" />
                          )}
                          <span>{row.status}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-5 rounded-2xl border border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] p-6 space-y-4 shadow-xs">
                  <h2 className="font-display text-lg font-bold">Store Dispatch Snapshot</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#5C577A] dark:text-[#B8B3D1]">WhatsApp Desk</span>
                      <span className="font-mono font-semibold">{STORE_CONFIG.whatsappDisplay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C577A] dark:text-[#B8B3D1]">Currency</span>
                      <span className="font-semibold">{STORE_CONFIG.currencyCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C577A] dark:text-[#B8B3D1]">Free COD Over</span>
                      <span className="font-semibold tabular-nums">
                        {formatPkr(STORE_CONFIG.freeShippingThresholdPkr)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C577A] dark:text-[#B8B3D1]">Standard Delivery</span>
                      <span className="font-semibold tabular-nums">
                        {formatPkr(STORE_CONFIG.standardShippingFeePkr)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'products' && (
            <div className="rounded-2xl border border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] shadow-xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-[#713BDB]/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold">Product Catalog (UI Preview)</h2>
                  <p className="text-xs text-[#5C577A] dark:text-[#B8B3D1] mt-0.5">
                    Displaying current storefront items. Connect Supabase{' '}
                    <span className="font-mono">public.products</span> to enable live mutations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreviewOnlyNotice('Adding products')}
                  className="px-4 py-2.5 bg-[#713BDB] text-white text-xs font-semibold rounded-xl hover:bg-[#5E2EC4] transition-colors self-start sm:self-auto"
                >
                  + Add Product (Connect DB)
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#713BDB]/10 dark:border-white/10 bg-[#F8F6FF] dark:bg-[#26223D] text-[11px] uppercase tracking-wider text-[#5C577A] dark:text-[#B8B3D1]">
                      <th className="py-3 px-5">Product</th>
                      <th className="py-3 px-4">SKU</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#713BDB]/10 dark:divide-white/10">
                    {catalogProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-9 rounded-lg overflow-hidden bg-[#F1EEFC] dark:bg-[#26223D] shrink-0">
                              <ProductImage
                                src={product.images[0]}
                                alt={product.name}
                                title={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-semibold text-[#24213A] dark:text-[#F4F2FF] whitespace-nowrap">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-[#5C577A] dark:text-[#B8B3D1]">
                          {product.sku}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#5C577A] dark:text-[#B8B3D1]">
                          {product.category}
                        </td>
                        <td className="py-3.5 px-4 font-bold tabular-nums whitespace-nowrap">
                          {formatPkr(product.pricePkr)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => handlePreviewOnlyNotice(`Editing ${product.name}`)}
                            className="text-xs font-semibold text-[#713BDB] dark:text-[#A78BFA] hover:underline"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'orders' && (
            <div className="rounded-2xl border border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] p-8 sm:p-12 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#F8F6FF] dark:bg-[#26223D] border border-[#713BDB]/15 dark:border-white/10 flex items-center justify-center text-[#713BDB] dark:text-[#A78BFA] mx-auto">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h2 className="font-display text-xl font-bold">
                Orders Pipeline Ready for Supabase Connection
              </h2>
              <p className="text-sm text-[#5C577A] dark:text-[#B8B3D1] max-w-lg mx-auto leading-relaxed">
                Customer orders are currently dispatched directly to WhatsApp (
                <span className="font-mono">{STORE_CONFIG.whatsappDisplay}</span>). Once{' '}
                <span className="font-mono">public.orders</span> is connected with RLS policies,
                Cash on Delivery order tracking, status updates, and dispatch history will appear
                here.
              </p>
            </div>
          )}

          {activeSection === 'categories' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold">Store Categories</h2>
                  <p className="text-xs text-[#5C577A] dark:text-[#B8B3D1]">
                    Structured view of active storefront collections.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreviewOnlyNotice('Creating categories')}
                  className="px-4 py-2.5 bg-[#713BDB] text-white text-xs font-semibold rounded-xl hover:bg-[#5E2EC4] transition-colors self-start sm:self-auto"
                >
                  + New Category (Connect DB)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.name}
                    className="rounded-2xl border border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] p-5 flex items-center justify-between shadow-xs"
                  >
                    <div>
                      <h3 className="font-display text-base font-bold">{cat.name}</h3>
                      <p className="text-xs text-[#5C577A] dark:text-[#B8B3D1] mt-1 tabular-nums">
                        {cat.count} products configured
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePreviewOnlyNotice(`Managing ${cat.name}`)}
                      className="px-3 py-1.5 rounded-lg bg-[#F8F6FF] dark:bg-[#26223D] text-xs font-semibold text-[#713BDB] dark:text-[#A78BFA]"
                    >
                      Configure
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'inventory' && (
            <div className="rounded-2xl border border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] shadow-xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-[#713BDB]/10 dark:border-white/10">
                <h2 className="font-display text-lg font-bold">SKU & Variant Availability</h2>
                <p className="text-xs text-[#5C577A] dark:text-[#B8B3D1] mt-0.5">
                  Stock adjustment actions require live Supabase inventory table integration.
                </p>
              </div>
              <div className="divide-y divide-[#713BDB]/10 dark:divide-white/10">
                {catalogProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-[#5C577A] dark:text-[#B8B3D1]">
                        {product.sku} · Colors: {product.colors.map((c) => c.name).join(', ')}
                        {product.sizes ? ` · Sizes: ${product.sizes.join(', ')}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-[#F8F6FF] dark:bg-[#26223D] text-xs font-mono font-semibold text-[#713BDB] dark:text-[#A78BFA]">
                        {product.inStock ? 'Available' : 'Unavailable'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePreviewOnlyNotice(`Updating stock for ${product.sku}`)}
                        className="px-3 py-1.5 rounded-lg border border-[#713BDB]/20 dark:border-white/15 text-xs font-semibold hover:border-[#713BDB]"
                      >
                        Adjust
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] p-6 space-y-4 shadow-xs">
                <h2 className="font-display text-lg font-bold">Storefront Configuration</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-[#6B6589] dark:text-[#9892B8]">Store Name</p>
                    <p className="font-semibold">{STORE_CONFIG.brandName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B6589] dark:text-[#9892B8]">
                      WhatsApp Order Dispatch Number
                    </p>
                    <p className="font-mono font-semibold">{STORE_CONFIG.whatsappDisplay}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B6589] dark:text-[#9892B8]">Support Email</p>
                    <p className="font-semibold">{STORE_CONFIG.supportEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B6589] dark:text-[#9892B8]">Dispatch Hubs</p>
                    <p className="font-semibold">{STORE_CONFIG.studioLocations}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] p-6 space-y-4 shadow-xs">
                <h2 className="font-display text-lg font-bold">Security & RLS Architecture</h2>
                <ul className="space-y-2.5 text-xs text-[#5C577A] dark:text-[#B8B3D1] leading-relaxed">
                  <li>
                    • Admin sessions are verified against Supabase Auth and{' '}
                    <span className="font-mono text-[#24213A] dark:text-[#F4F2FF]">
                      public.admin_users
                    </span>{' '}
                    on every privileged check.
                  </li>
                  <li>
                    • No passwords, secrets, or service-role keys are stored or exposed in browser
                    bundle code.
                  </li>
                  <li>
                    • Admin session tokens remain strictly in memory and are never persisted to{' '}
                    <span className="font-mono text-[#24213A] dark:text-[#F4F2FF]">
                      localStorage
                    </span>
                    .
                  </li>
                  <li>
                    • Supabase Row Level Security policies in{' '}
                    <span className="font-mono text-[#24213A] dark:text-[#F4F2FF]">
                      supabase/schema.sql
                    </span>{' '}
                    restrict admin mutations exclusively to verified active admins.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
