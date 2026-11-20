import { CartItem, OrderRecord } from '../types/store';

const STORAGE_KEYS = {
  CART: 'shopzayn_cart_v1',
  WISHLIST: 'shopzayn_wishlist_v1',
  RECENTLY_VIEWED: 'shopzayn_recently_viewed_v1',
  LAST_ORDER: 'shopzayn_last_order_v1',
  NEWSLETTER: 'shopzayn_newsletter_v1',
  CONTACT_INQUIRIES: 'shopzayn_inquiries_v1',
} as const;

export const storageService = {
  getCart(): CartItem[] {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.CART);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveCart(items: CartItem[]): void {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    } catch {
      // Ignore storage quota issues gracefully
    }
  },

  getWishlist(): string[] {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  },

  saveWishlist(productIds: string[]): void {
    try {
      window.localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(productIds));
    } catch {
      // Ignore storage quota issues
    }
  },

  getRecentlyViewed(): string[] {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  },

  saveRecentlyViewed(productIds: string[]): void {
    try {
      window.localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(productIds));
    } catch {
      // Ignore storage quota issues
    }
  },

  getLastOrder(): OrderRecord | null {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.LAST_ORDER);
      if (!raw) return null;
      return JSON.parse(raw) as OrderRecord;
    } catch {
      return null;
    }
  },

  saveLastOrder(order: OrderRecord): void {
    try {
      window.localStorage.setItem(STORAGE_KEYS.LAST_ORDER, JSON.stringify(order));
    } catch {
      // Ignore storage quota issues
    }
  },

  saveNewsletterEmail(email: string): { alreadySubscribed: boolean } {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.NEWSLETTER);
      const list: string[] = raw ? JSON.parse(raw) : [];
      const normalized = email.trim().toLowerCase();
      if (list.includes(normalized)) {
        return { alreadySubscribed: true };
      }
      window.localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify([...list, normalized]));
      return { alreadySubscribed: false };
    } catch {
      return { alreadySubscribed: false };
    }
  },

  saveContactInquiry(entry: { name: string; email: string; phone: string; message: string }): void {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.CONTACT_INQUIRIES);
      const list = raw ? JSON.parse(raw) : [];
      window.localStorage.setItem(
        STORAGE_KEYS.CONTACT_INQUIRIES,
        JSON.stringify([{ ...entry, createdAt: new Date().toISOString() }, ...list].slice(0, 20))
      );
    } catch {
      // Ignore storage errors
    }
  },
};
