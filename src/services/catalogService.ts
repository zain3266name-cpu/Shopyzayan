import { SAMPLE_PRODUCTS } from '../data/products';
import { getDiscountPercent } from '../config/storeConfig';
import { CollectionFilter, Product, ProductCategory, SortOption } from '../types/store';

export interface CatalogQueryOptions {
  category?: ProductCategory;
  collection?: CollectionFilter;
  searchQuery?: string;
  sortBy?: SortOption;
}

/**
 * Product catalog service abstraction.
 * Currently reads from local sample catalog; designed to swap cleanly
 * to Firebase Firestore or REST endpoints in Phase 2 without UI changes.
 */
export const catalogService = {
  getAllProducts(): Product[] {
    return SAMPLE_PRODUCTS;
  },

  getProductBySlug(slug: string): Product | undefined {
    return SAMPLE_PRODUCTS.find((item) => item.slug === slug);
  },

  getRelatedProducts(product: Product, limit = 3): Product[] {
    const sameCategory = SAMPLE_PRODUCTS.filter(
      (item) => item.id !== product.id && item.category === product.category
    );
    const others = SAMPLE_PRODUCTS.filter(
      (item) => item.id !== product.id && item.category !== product.category
    );
    return [...sameCategory, ...others].slice(0, limit);
  },

  queryProducts(options: CatalogQueryOptions): Product[] {
    const {
      category = 'All',
      collection = 'all',
      searchQuery = '',
      sortBy = 'featured',
    } = options;

    const normalizedSearch = searchQuery.trim().toLowerCase();

    const filtered = SAMPLE_PRODUCTS.filter((product) => {
      if (category !== 'All' && product.category !== category) {
        return false;
      }

      if (collection !== 'all' && !product.collections.includes(collection)) {
        return false;
      }

      if (normalizedSearch) {
        const haystack = [
          product.name,
          product.category,
          product.sku,
          product.description,
          ...product.colors.map((c) => c.name),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(normalizedSearch)) {
          return false;
        }
      }

      return true;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case 'priceAsc':
        sorted.sort((a, b) => a.pricePkr - b.pricePkr);
        break;
      case 'priceDesc':
        sorted.sort((a, b) => b.pricePkr - a.pricePkr);
        break;
      case 'discountDesc':
        sorted.sort(
          (a, b) =>
            getDiscountPercent(b.pricePkr, b.originalPricePkr) -
            getDiscountPercent(a.pricePkr, a.originalPricePkr)
        );
        break;
      case 'featured':
      default:
        break;
    }

    return sorted;
  },
};
