import { ArrowRight, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { formatPkr } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { catalogService } from '../services/catalogService';
import { ProductCategory } from '../types/store';
import { ProductImage } from './ProductImage';

const QUICK_CATEGORIES: ProductCategory[] = [
  'Watches & Eyewear',
  'Leather Goods',
  'Apparel',
  'Fragrances',
  'Home & Living',
];

export function SearchOverlay() {
  const { isSearchOpen, setIsSearchOpen, navigate } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return catalogService.getAllProducts().slice(0, 4);
    }
    return catalogService.queryProducts({ searchQuery: query }).slice(0, 6);
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('shop', { searchQuery: query, category: 'All', collection: 'all' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        className="fixed inset-0 bg-[#24213A]/50 backdrop-blur-xs"
        onClick={() => setIsSearchOpen(false)}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search ShopZayn catalog"
        className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#713BDB]/15 overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="flex items-center border-b border-[#713BDB]/10 px-4">
          <Search className="w-5 h-5 text-[#713BDB] shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search watches, leather totes, fragrances, apparel..."
            className="w-full py-4 px-3 text-sm sm:text-base text-[#24213A] placeholder:text-[#8E89A8] focus:outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
            className="p-2 text-[#5C577A] hover:text-[#24213A] rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </form>

        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#6B6589] mb-2.5">
              Browse Categories
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    navigate('shop', { category, collection: 'all', searchQuery: '' })
                  }
                  className="px-3 py-1.5 text-xs font-semibold bg-[#F8F6FF] text-[#24213A] border border-[#713BDB]/15 hover:bg-[#713BDB] hover:text-white rounded-xl transition-colors whitespace-nowrap"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#6B6589]">
                {query.trim() ? `Matches (${results.length})` : 'Popular Picks'}
              </p>
              {query.trim() && (
                <button
                  type="button"
                  onClick={() =>
                    navigate('shop', { searchQuery: query, category: 'All', collection: 'all' })
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#713BDB] hover:underline"
                >
                  <span>View all in Shop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm font-semibold text-[#24213A]">
                  No products found for "{query}"
                </p>
                <p className="text-xs text-[#5C577A] mt-1">
                  Try searching for chronograph, tote, oud, wallet, or overshirt.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => navigate('product', { slug: product.slug })}
                    className="flex items-center gap-3 p-2 rounded-xl border border-[#713BDB]/10 hover:border-[#713BDB] hover:bg-[#F8F6FF] text-left transition-colors"
                  >
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-[#F1EEFC] shrink-0">
                      <ProductImage
                        src={product.images[0]}
                        alt={product.name}
                        title={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#24213A] truncate">{product.name}</p>
                      <p className="text-xs font-medium text-[#713BDB] tabular-nums mt-0.5">
                        {formatPkr(product.pricePkr)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
