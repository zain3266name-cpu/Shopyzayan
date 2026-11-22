import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STORE_CONFIG } from '../config/storeConfig';
import { catalogService } from '../services/catalogService';
import { calculateCartTotals, resolvePromoCode } from '../services/orderService';
import { storageService } from '../services/storageService';
import {
  CartItem,
  CollectionFilter,
  OrderRecord,
  PageRoute,
  Product,
  ProductCategory,
  SortOption,
  ThemeMode,
  ToastMessage,
} from '../types/store';

interface ShopFiltersState {
  category: ProductCategory;
  collection: CollectionFilter;
  searchQuery: string;
  sortBy: SortOption;
}

interface StoreContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  route: PageRoute;
  activeProductSlug: string | null;
  navigate: (
    route: PageRoute,
    options?: {
      slug?: string;
      category?: ProductCategory;
      collection?: CollectionFilter;
      searchQuery?: string;
    }
  ) => void;
  filters: ShopFiltersState;
  setCategory: (category: ProductCategory) => void;
  setCollection: (collection: CollectionFilter) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortOption) => void;
  resetFilters: () => void;
  cart: CartItem[];
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  cartTotals: {
    itemCount: number;
    subtotalPkr: number;
    discountPkr: number;
    appliedPromoCode: string | null;
    shippingPkr: number;
    totalPkr: number;
  };
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  addToCart: (
    product: Product,
    options?: { color?: string; size?: string; quantity?: number; openDrawer?: boolean }
  ) => void;
  updateCartQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  wishlistIds: string[];
  wishlistProducts: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  recentlyViewedIds: string[];
  recentlyViewedProducts: Product[];
  recordProductView: (productId: string) => void;
  lastOrder: OrderRecord | null;
  setLastOrder: (order: OrderRecord | null) => void;
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, variant?: ToastMessage['variant']) => void;
  dismissToast: (id: string) => void;
}

const DEFAULT_FILTERS: ShopFiltersState = {
  category: 'All',
  collection: 'all',
  searchQuery: '',
  sortBy: 'featured',
};

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function parseHashRoute(): { route: PageRoute; slug: string | null } {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash) return { route: 'home', slug: null };
  const [segment, param] = hash.split('/');
  switch (segment) {
    case 'shop':
      return { route: 'shop', slug: null };
    case 'product':
      return { route: param ? 'product' : 'shop', slug: param || null };
    case 'wishlist':
      return { route: 'wishlist', slug: null };
    case 'cart':
      return { route: 'cart', slug: null };
    case 'checkout':
      return { route: 'checkout', slug: null };
    case 'about':
      return { route: 'about', slug: null };
    case 'contact':
      return { route: 'contact', slug: null };
    default:
      return { route: 'home', slug: null };
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const initialHash = parseHashRoute();
  const [theme, setTheme] = useState<ThemeMode>(() => storageService.getTheme());
  const [route, setRoute] = useState<PageRoute>(initialHash.route);
  const [activeProductSlug, setActiveProductSlug] = useState<string | null>(initialHash.slug);
  const [filters, setFilters] = useState<ShopFiltersState>(DEFAULT_FILTERS);
  const [cart, setCart] = useState<CartItem[]>(() => storageService.getCart());
  const [promoCode, setPromoCode] = useState<string>(() => storageService.getPromoCode());
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => storageService.getWishlist());
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() =>
    storageService.getRecentlyViewed()
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<OrderRecord | null>(() => storageService.getLastOrder());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    storageService.saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    storageService.saveCart(cart);
  }, [cart]);

  useEffect(() => {
    storageService.savePromoCode(promoCode);
  }, [promoCode]);

  useEffect(() => {
    storageService.saveWishlist(wishlistIds);
  }, [wishlistIds]);

  useEffect(() => {
    storageService.saveRecentlyViewed(recentlyViewedIds);
  }, [recentlyViewedIds]);

  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHashRoute();
      setRoute(parsed.route);
      setActiveProductSlug(parsed.slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, description?: string, variant: ToastMessage['variant'] = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-2), { id, title, description, variant }]);
      window.setTimeout(() => {
        dismissToast(id);
      }, 3600);
    },
    [dismissToast]
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      return next;
    });
  }, []);

  const navigate = useCallback(
    (
      nextRoute: PageRoute,
      options?: {
        slug?: string;
        category?: ProductCategory;
        collection?: CollectionFilter;
        searchQuery?: string;
      }
    ) => {
      if (
        options?.category !== undefined ||
        options?.collection !== undefined ||
        options?.searchQuery !== undefined
      ) {
        setFilters((prev) => ({
          ...prev,
          category: options.category ?? prev.category,
          collection: options.collection ?? prev.collection,
          searchQuery: options.searchQuery ?? prev.searchQuery,
        }));
      }

      const nextSlug = options?.slug ?? null;
      setRoute(nextRoute);
      setActiveProductSlug(nextSlug);
      setIsCartOpen(false);
      setIsSearchOpen(false);
      setQuickViewProduct(null);

      const targetHash =
        nextRoute === 'home'
          ? '#/'
          : nextRoute === 'product' && nextSlug
          ? `#/product/${nextSlug}`
          : `#/${nextRoute}`;

      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const setCategory = useCallback((category: ProductCategory) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setCollection = useCallback((collection: CollectionFilter) => {
    setFilters((prev) => ({ ...prev, collection }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const applyPromoCode = useCallback(
    (rawCode: string) => {
      const resolved = resolvePromoCode(rawCode);
      if (!resolved) {
        showToast(
          'Invalid promo code',
          'Try ZAYN10 for 10% off or FREESHIP for free delivery.',
          'error'
        );
        return false;
      }
      setPromoCode(resolved.code);
      showToast('Promo code applied', `${resolved.code} — ${resolved.label}`);
      return true;
    },
    [showToast]
  );

  const removePromoCode = useCallback(() => {
    setPromoCode('');
    showToast('Promo code removed', undefined, 'info');
  }, [showToast]);

  const addToCart = useCallback(
    (
      product: Product,
      options?: { color?: string; size?: string; quantity?: number; openDrawer?: boolean }
    ) => {
      const selectedColor = options?.color || product.colors[0]?.name || 'Standard';
      const selectedSize = options?.size || (product.sizes ? product.sizes[0] : undefined);
      const quantity = Math.max(1, options?.quantity ?? 1);
      const key = `${product.id}__${selectedColor}__${selectedSize || 'onesize'}`;

      setCart((prev) => {
        const existingIndex = prev.findIndex((item) => item.key === key);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }

        const newItem: CartItem = {
          key,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          sku: product.sku,
          image: product.images[0],
          pricePkr: product.pricePkr,
          originalPricePkr: product.originalPricePkr,
          selectedColor,
          selectedSize,
          quantity,
        };
        return [...prev, newItem];
      });

      const variantInfo = [selectedColor, selectedSize].filter(Boolean).join(' · ');
      showToast('Added to bag', `${product.name}${variantInfo ? ` (${variantInfo})` : ''}`);

      if (options?.openDrawer) {
        setIsCartOpen(true);
      }
    },
    [showToast]
  );

  const updateCartQuantity = useCallback((key: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.key !== key));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: Math.min(20, quantity) } : item))
    );
  }, []);

  const removeFromCart = useCallback(
    (key: string) => {
      setCart((prev) => {
        const removed = prev.find((i) => i.key === key);
        if (removed) {
          showToast('Removed from bag', removed.name, 'info');
        }
        return prev.filter((item) => item.key !== key);
      });
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setPromoCode('');
  }, []);

  const toggleWishlist = useCallback(
    (product: Product) => {
      setWishlistIds((prev) => {
        const exists = prev.includes(product.id);
        if (exists) {
          showToast('Removed from wishlist', product.name, 'info');
          return prev.filter((id) => id !== product.id);
        }
        showToast('Saved to wishlist', product.name);
        return [product.id, ...prev];
      });
    },
    [showToast]
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
    showToast('Wishlist cleared', 'All saved items were removed.', 'info');
  }, [showToast]);

  const recordProductView = useCallback((productId: string) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, STORE_CONFIG.maxRecentlyViewed);
    });
  }, []);

  const wishlistProducts = useMemo(() => {
    const all = catalogService.getAllProducts();
    return wishlistIds
      .map((id) => all.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [wishlistIds]);

  const recentlyViewedProducts = useMemo(() => {
    const all = catalogService.getAllProducts();
    return recentlyViewedIds
      .map((id) => all.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [recentlyViewedIds]);

  const cartTotals = useMemo(() => calculateCartTotals(cart, promoCode), [cart, promoCode]);

  const value: StoreContextValue = {
    theme,
    toggleTheme,
    route,
    activeProductSlug,
    navigate,
    filters,
    setCategory,
    setCollection,
    setSearchQuery,
    setSortBy,
    resetFilters,
    cart,
    promoCode,
    applyPromoCode,
    removePromoCode,
    cartTotals,
    isCartOpen,
    setIsCartOpen,
    isSearchOpen,
    setIsSearchOpen,
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    wishlistIds,
    wishlistProducts,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    recentlyViewedIds,
    recentlyViewedProducts,
    recordProductView,
    lastOrder,
    setLastOrder,
    toasts,
    showToast,
    dismissToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
