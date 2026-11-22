import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

interface RecentlyViewedSectionProps {
  excludeProductId?: string;
}

export function RecentlyViewedSection({ excludeProductId }: RecentlyViewedSectionProps) {
  const { recentlyViewedProducts, navigate } = useStore();

  const items = excludeProductId
    ? recentlyViewedProducts.filter((p) => p.id !== excludeProductId)
    : recentlyViewedProducts;

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#713BDB]/10 dark:border-white/10">
      <div className="flex items-end justify-between gap-4 mb-7">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[#713BDB] dark:text-[#A78BFA] font-semibold">
            Your History
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#24213A] dark:text-[#F4F2FF] mt-1">
            Recently Viewed
          </h2>
        </div>
        <button
          type="button"
          onClick={() => navigate('shop', { category: 'All', collection: 'all' })}
          className="text-sm font-semibold text-[#713BDB] dark:text-[#A78BFA] hover:underline underline-offset-4 whitespace-nowrap"
        >
          View Catalog
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {items.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
