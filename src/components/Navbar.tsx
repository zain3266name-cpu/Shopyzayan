import { Heart, Menu, Moon, Search, ShoppingBag, Sun, User, X } from 'lucide-react';
import { useState } from 'react';
import { formatPkr, STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { PageRoute } from '../types/store';

const NAV_LINKS: Array<{ label: string; route: PageRoute }> = [
  { label: 'Home', route: 'home' },
  { label: 'Shop', route: 'shop' },
  { label: 'About', route: 'about' },
  { label: 'Contact', route: 'contact' },
];

export function Navbar() {
  const {
    theme,
    toggleTheme,
    route,
    navigate,
    cartTotals,
    wishlistIds,
    setIsCartOpen,
    setIsSearchOpen,
  } = useStore();
  const [showPromo, setShowPromo] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const handleNavClick = (target: PageRoute) => {
    setMobileMenuOpen(false);
    navigate(target);
  };

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate('shop', {
      searchQuery: headerSearch.trim(),
      category: 'All',
      collection: 'all',
    });
  };

  return (
    <>
      {showPromo && (
        <div className="bg-gradient-to-r from-[#713BDB] via-[#B4469F] to-[#FF626E] text-white text-xs py-2 px-4 relative flex items-center justify-center">
          <p className="text-center font-medium tracking-wide pr-6 truncate">
            Free COD over{' '}
            <span className="font-bold tabular-nums text-[#FFC83D]">
              {formatPkr(STORE_CONFIG.freeShippingThresholdPkr)}
            </span>{' '}
            · Use code <span className="font-mono font-bold text-[#FFC83D]">ZAYN10</span> for 10% off
          </p>
          <button
            type="button"
            onClick={() => setShowPromo(false)}
            aria-label="Dismiss announcement"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#1C192E]/95 backdrop-blur-md border-b border-[#713BDB]/10 dark:border-white/10 shadow-xs transition-colors">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
          {/* Zone 1: Colorful ShopZayn Wordmark */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="font-display text-2xl font-bold tracking-tight bg-gradient-to-r from-[#713BDB] to-[#FF626E] dark:from-[#A78BFA] dark:to-[#FF626E] bg-clip-text text-transparent whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#713BDB] rounded-xs"
          >
            {STORE_CONFIG.brandName}
          </button>

          {/* Zone 2: Navigation links + Desktop Search Bar */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center min-w-0">
            <nav
              aria-label="Primary navigation"
              className="flex items-center gap-6 text-sm font-medium text-[#5C577A] dark:text-[#B8B3D1]"
            >
              {NAV_LINKS.map((item) => {
                const isActive =
                  route === item.route || (route === 'product' && item.route === 'shop');
                return (
                  <button
                    key={item.route}
                    type="button"
                    onClick={() => handleNavClick(item.route)}
                    className={`relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-[#713BDB] dark:hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#713BDB] ${
                      isActive ? 'text-[#24213A] dark:text-white font-semibold' : ''
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#713BDB] to-[#FF626E]"
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            <form
              onSubmit={handleHeaderSearch}
              className="hidden lg:flex items-center relative w-full max-w-[240px]"
            >
              <Search className="w-4 h-4 text-[#6B6589] dark:text-[#B8B3D1] absolute left-3 pointer-events-none" />
              <input
                type="search"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Search products..."
                aria-label="Search ShopZayn catalog"
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F6FF] dark:bg-[#26223D] border border-[#713BDB]/15 dark:border-white/10 rounded-xl text-[#24213A] dark:text-[#F4F2FF] placeholder:text-[#7A7496] dark:placeholder:text-[#8E89A8] focus:outline-none focus:bg-white dark:focus:bg-[#2E294A] focus:border-[#713BDB] transition-colors"
              />
            </form>
          </div>

          {/* Zone 3: Search, Theme Toggle, Orders, Wishlist & Cart */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open product search"
              className="lg:hidden p-2 text-[#24213A] dark:text-[#F4F2FF] hover:text-[#713BDB] hover:bg-[#F8F6FF] dark:hover:bg-[#26223D] rounded-xl transition-colors"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              className="p-2 text-[#24213A] dark:text-[#FFC83D] hover:text-[#713BDB] hover:bg-[#F8F6FF] dark:hover:bg-[#26223D] rounded-xl transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-[18px] h-[18px]" />
              ) : (
                <Moon className="w-[18px] h-[18px]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('checkout')}
              aria-label="Orders and Checkout"
              title="Orders & Checkout"
              className={`hidden sm:inline-flex p-2 rounded-xl transition-colors ${
                route === 'checkout'
                  ? 'text-[#713BDB] dark:text-[#A78BFA] bg-[#F8F6FF] dark:bg-[#26223D]'
                  : 'text-[#24213A] dark:text-[#F4F2FF] hover:text-[#713BDB] hover:bg-[#F8F6FF] dark:hover:bg-[#26223D]'
              }`}
            >
              <User className="w-[18px] h-[18px]" />
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('wishlist')}
              aria-label={`Open wishlist with ${wishlistIds.length} saved items`}
              title="Wishlist"
              className={`relative p-2 rounded-xl transition-colors ${
                route === 'wishlist'
                  ? 'text-[#FF626E] bg-[#FFF0F2] dark:bg-[#FF626E]/15'
                  : 'text-[#24213A] dark:text-[#F4F2FF] hover:text-[#FF626E] hover:bg-[#F8F6FF] dark:hover:bg-[#26223D]'
              }`}
            >
              <Heart
                className={`w-[18px] h-[18px] ${
                  wishlistIds.length > 0 ? 'fill-[#FF626E] text-[#FF626E]' : ''
                }`}
              />
              {wishlistIds.length > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#FF626E] text-white text-[10px] font-mono tabular-nums flex items-center justify-center leading-none">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open shopping bag with ${cartTotals.itemCount} items`}
              className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 text-xs font-semibold bg-[#713BDB] text-white rounded-xl hover:bg-[#5E2EC4] transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="tabular-nums font-mono text-[11px] bg-[#FFC83D] text-[#24213A] font-bold px-1.5 py-0.5 rounded-md">
                {cartTotals.itemCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 text-[#24213A] dark:text-[#F4F2FF] hover:text-[#713BDB] hover:bg-[#F8F6FF] dark:hover:bg-[#26223D] rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#713BDB]/10 dark:border-white/10 bg-white dark:bg-[#1C192E] px-4 py-4 space-y-3">
            <form onSubmit={handleHeaderSearch} className="relative">
              <Search className="w-4 h-4 text-[#6B6589] dark:text-[#B8B3D1] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#F8F6FF] dark:bg-[#26223D] border border-[#713BDB]/15 dark:border-white/10 rounded-xl text-[#24213A] dark:text-[#F4F2FF] placeholder:text-[#7A7496] focus:outline-none focus:border-[#713BDB]"
              />
            </form>

            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => {
                const isActive =
                  route === item.route || (route === 'product' && item.route === 'shop');
                return (
                  <button
                    key={item.route}
                    type="button"
                    onClick={() => handleNavClick(item.route)}
                    className={`w-full text-left px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#F8F6FF] dark:bg-[#26223D] text-[#713BDB] dark:text-[#A78BFA] font-semibold'
                        : 'text-[#24213A] dark:text-[#F4F2FF] hover:bg-[#F8F6FF] dark:hover:bg-[#26223D]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => handleNavClick('wishlist')}
                className="w-full text-left px-3 py-3 rounded-xl text-sm font-medium text-[#24213A] dark:text-[#F4F2FF] hover:bg-[#F8F6FF] dark:hover:bg-[#26223D]"
              >
                Wishlist ({wishlistIds.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('cart');
                }}
                className="w-full text-left px-3 py-3 rounded-xl text-sm font-medium text-[#24213A] dark:text-[#F4F2FF] hover:bg-[#F8F6FF] dark:hover:bg-[#26223D]"
              >
                Shopping Cart ({cartTotals.itemCount})
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('checkout')}
                className="w-full text-left px-3 py-3 rounded-xl text-sm font-medium text-[#24213A] dark:text-[#F4F2FF] hover:bg-[#F8F6FF] dark:hover:bg-[#26223D]"
              >
                Checkout & Orders
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
