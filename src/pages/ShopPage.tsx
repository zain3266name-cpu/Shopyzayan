import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { RecentlyViewedSection } from '../components/RecentlyViewedSection';
import { useStore } from '../context/StoreContext';
import { catalogService } from '../services/catalogService';
import { CollectionFilter, ProductCategory, SortOption } from '../types/store';

const CATEGORIES: ProductCategory[] = [
  'All',
  'Watches & Eyewear',
  'Leather Goods',
  'Apparel',
  'Fragrances',
  'Home & Living',
];

const COLLECTIONS: Array<{ id: CollectionFilter; label: string }> = [
  { id: 'all', label: 'All Items' },
  { id: 'trending', label: 'Featured' },
  { id: 'bestSeller', label: 'Best Sellers' },
  { id: 'newArrival', label: 'New Arrivals' },
  { id: 'onSale', label: 'Special Offers' },
];

export function ShopPage() {
  const {
    filters,
    setCategory,
    setCollection,
    setSearchQuery,
    setSortBy,
    resetFilters,
  } = useStore();

  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    setIsFiltering(true);
    const timer = window.setTimeout(() => setIsFiltering(false), 140);
    return () => window.clearTimeout(timer);
  }, [filters.category, filters.collection, filters.sortBy]);

  const products = useMemo(() => {
    return catalogService.queryProducts({
      category: filters.category,
      collection: filters.collection,
      searchQuery: filters.searchQuery,
      sortBy: filters.sortBy,
    });
  }, [filters]);

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.collection !== 'all' ||
    filters.searchQuery.trim() !== '' ||
    filters.sortBy !== 'featured';

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#713BDB]/15 dark:border-white/10">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[#713BDB] dark:text-[#A78BFA] font-bold">
            Catalog
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#24213A] dark:text-[#F4F2FF] mt-1">
            {filters.category === 'All' ? 'All Products' : filters.category}
          </h1>
        </div>
        <p className="text-sm text-[#5C577A] dark:text-[#B8B3D1] tabular-nums">
          Showing{' '}
          <span className="font-bold text-[#24213A] dark:text-[#F4F2FF]">{products.length}</span>{' '}
          {products.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Controls Bar */}
      <div className="py-6 space-y-5 border-b border-[#713BDB]/10 dark:border-white/10">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#713BDB] dark:text-[#A78BFA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, SKU, or material..."
              aria-label="Search products"
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-white dark:bg-[#1C192E] border border-[#713BDB]/20 dark:border-white/15 rounded-xl text-[#24213A] dark:text-[#F4F2FF] placeholder:text-[#8E89A8] focus:outline-none focus:border-[#713BDB] transition-colors"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#8E89A8] hover:text-[#24213A] dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#713BDB] dark:text-[#A78BFA]" />
              <label htmlFor="collection-select" className="sr-only">
                Collection filter
              </label>
              <select
                id="collection-select"
                value={filters.collection}
                onChange={(e) => setCollection(e.target.value as CollectionFilter)}
                className="px-3 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#1C192E] border border-[#713BDB]/20 dark:border-white/15 rounded-xl text-[#24213A] dark:text-[#F4F2FF] focus:outline-none focus:border-[#713BDB]"
              >
                {COLLECTIONS.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort-select" className="sr-only">
                Sort products
              </label>
              <select
                id="sort-select"
                value={filters.sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#1C192E] border border-[#713BDB]/20 dark:border-white/15 rounded-xl text-[#24213A] dark:text-[#F4F2FF] focus:outline-none focus:border-[#713BDB]"
              >
                <option value="featured">Sort: Featured</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="discountDesc">Biggest Discount</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-[#FF626E] hover:bg-[#FFF0F2] dark:hover:bg-[#FF626E]/15 rounded-xl transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter by category"
          className="flex items-center gap-2 overflow-x-auto pb-1"
        >
          {CATEGORIES.map((category) => {
            const active = filters.category === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(category)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 border ${
                  active
                    ? 'bg-[#713BDB] text-white border-[#713BDB] shadow-xs'
                    : 'bg-white dark:bg-[#1C192E] text-[#5C577A] dark:text-[#B8B3D1] border-[#713BDB]/15 dark:border-white/10 hover:border-[#713BDB] hover:text-[#24213A] dark:hover:text-white'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      <div className="pt-8">
        {isFiltering ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="animate-pulse bg-white dark:bg-[#1C192E] rounded-2xl p-3 border border-[#713BDB]/10 dark:border-white/10"
              >
                <div className="aspect-[4/3] w-full rounded-xl bg-[#EFEBFB] dark:bg-[#26223D]" />
                <div className="h-3 w-20 bg-[#EFEBFB] dark:bg-[#26223D] rounded mt-3.5" />
                <div className="h-4 w-36 bg-[#EFEBFB] dark:bg-[#26223D] rounded mt-2" />
                <div className="h-8 w-full bg-[#EFEBFB] dark:bg-[#26223D] rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#713BDB]/25 dark:border-white/15 rounded-2xl bg-white dark:bg-[#1C192E]">
            <p className="text-base font-bold text-[#24213A] dark:text-[#F4F2FF]">
              No matching products found
            </p>
            <p className="text-sm text-[#5C577A] dark:text-[#B8B3D1] mt-1.5 max-w-md mx-auto">
              Try clearing your search terms or switching back to all categories.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#713BDB] text-white text-sm font-semibold rounded-xl hover:bg-[#5E2EC4] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-16">
        <RecentlyViewedSection />
      </div>
    </div>
  );
}
