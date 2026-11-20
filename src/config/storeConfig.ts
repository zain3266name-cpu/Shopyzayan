/**
 * Central storefront configuration.
 * Replace `whatsappNumber` with your active WhatsApp Business or personal number
 * (country code + number without "+" or spaces, e.g. "923001234567").
 * Designed so future backend/Firebase remote config can hydrate these values cleanly.
 */
export const STORE_CONFIG = {
  brandName: 'ShopZayn',
  currencyCode: 'PKR',
  currencySymbol: 'Rs.',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '923001234567',
  whatsappDisplay: '+92 300 1234567',
  whatsappSupportMessage:
    'Hello ShopZayn! I need help with a product or placing an order.',
  supportEmail: 'hello@shopzayn.pk',
  studioLocations: 'Lahore · Karachi · Islamabad',
  dispatchHours: 'Mon – Sat, 10:00 AM – 8:00 PM PKT',
  freeShippingThresholdPkr: 10000,
  standardShippingFeePkr: 250,
  estimatedDeliveryWindow: '2–4 business days across Pakistan',
  maxRecentlyViewed: 6,
  pakistaniCities: [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala',
    'Hyderabad',
    'Bahawalpur',
    'Abbottabad',
    'Other',
  ],
} as const;

export function formatPkr(amount: number): string {
  return `${STORE_CONFIG.currencySymbol} ${amount.toLocaleString('en-PK')}`;
}

export function getDiscountPercent(pricePkr: number, originalPricePkr?: number): number {
  if (!originalPricePkr || originalPricePkr <= pricePkr) {
    return 0;
  }
  return Math.round(((originalPricePkr - pricePkr) / originalPricePkr) * 100);
}

export type ProductBadgeKind = 'Sale' | 'Best Seller' | 'New Arrival';

export function getProductBadges(product: {
  pricePkr: number;
  originalPricePkr?: number;
  collections: Array<'trending' | 'bestSeller' | 'newArrival' | 'onSale'>;
}): ProductBadgeKind[] {
  const badges: ProductBadgeKind[] = [];
  if (getDiscountPercent(product.pricePkr, product.originalPricePkr) > 0 || product.collections.includes('onSale')) {
    badges.push('Sale');
  }
  if (product.collections.includes('bestSeller')) {
    badges.push('Best Seller');
  }
  if (product.collections.includes('newArrival')) {
    badges.push('New Arrival');
  }
  return badges;
}

export function getPrimaryProductBadge(product: {
  pricePkr: number;
  originalPricePkr?: number;
  collections: Array<'trending' | 'bestSeller' | 'newArrival' | 'onSale'>;
}): ProductBadgeKind | null {
  const badges = getProductBadges(product);
  return badges[0] ?? null;
}
