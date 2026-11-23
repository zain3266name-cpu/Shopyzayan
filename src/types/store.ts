export type PageRoute =
  | 'home'
  | 'shop'
  | 'product'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'about'
  | 'contact'
  | 'admin-login'
  | 'admin';

export type AdminSection =
  | 'overview'
  | 'products'
  | 'orders'
  | 'categories'
  | 'inventory'
  | 'settings';

export interface AdminUserProfile {
  id: string;
  email: string;
  role: string;
}

export interface AdminAuthState {
  status: 'unauthenticated' | 'checking' | 'authenticated' | 'unconfigured' | 'denied';
  user: AdminUserProfile | null;
  accessToken: string | null;
  errorMessage: string | null;
}

export type ProductCategory =
  | 'All'
  | 'Apparel'
  | 'Watches & Eyewear'
  | 'Leather Goods'
  | 'Fragrances'
  | 'Home & Living';

export type CollectionFilter =
  | 'all'
  | 'trending'
  | 'bestSeller'
  | 'newArrival'
  | 'onSale';

export type SortOption =
  | 'featured'
  | 'priceAsc'
  | 'priceDesc'
  | 'discountDesc';

export interface ProductColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: Exclude<ProductCategory, 'All'>;
  pricePkr: number;
  originalPricePkr?: number;
  shortTag?: string;
  collections: Array<Exclude<CollectionFilter, 'all'>>;
  description: string;
  details: string[];
  images: string[];
  colors: ProductColorOption[];
  sizes?: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  category: string;
  sku: string;
  image: string;
  pricePkr: number;
  originalPricePkr?: number;
  selectedColor: string;
  selectedSize?: string;
  quantity: number;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
  paymentMethod: 'COD';
}

export type ThemeMode = 'light' | 'dark';

export interface OrderRecord {
  orderNumber: string;
  createdAtIso: string;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotalPkr: number;
  discountPkr?: number;
  promoCode?: string;
  shippingPkr: number;
  totalPkr: number;
  whatsappMessage: string;
  whatsappUrl: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'info' | 'error';
}
