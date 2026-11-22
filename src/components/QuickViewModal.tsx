import { ArrowRight, Heart, Minus, Plus, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatPkr, getDiscountPercent, getProductBadges } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { ProductImage } from './ProductImage';

export function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigate,
  } = useStore();

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedColor(quickViewProduct.colors[0]?.name || 'Standard');
      setSelectedSize(quickViewProduct.sizes ? quickViewProduct.sizes[0] : undefined);
      setQuantity(1);
    }
  }, [quickViewProduct]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && quickViewProduct) {
        setQuickViewProduct(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [quickViewProduct, setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const discountPercent = getDiscountPercent(
    quickViewProduct.pricePkr,
    quickViewProduct.originalPricePkr
  );
  const badges = getProductBadges(quickViewProduct);
  const wishlisted = isInWishlist(quickViewProduct.id);

  const handleAdd = () => {
    addToCart(quickViewProduct, {
      color: selectedColor,
      size: selectedSize,
      quantity,
      openDrawer: true,
    });
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#24213A]/60 dark:bg-black/70 backdrop-blur-xs"
        onClick={() => setQuickViewProduct(null)}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view ${quickViewProduct.name}`}
        className="relative z-10 w-full max-w-3xl bg-white dark:bg-[#1C192E] rounded-2xl border border-[#713BDB]/15 dark:border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 dark:bg-[#26223D]/90 text-[#24213A] dark:text-[#F4F2FF] border border-black/10 dark:border-white/10 hover:text-[#713BDB] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="md:col-span-6 bg-[#F1EEFC] dark:bg-[#26223D] aspect-[4/3] md:aspect-auto md:h-full">
          <ProductImage
            src={quickViewProduct.images[0]}
            alt={quickViewProduct.name}
            title={quickViewProduct.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:col-span-6 p-6 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C577A] dark:text-[#B8B3D1]">
              <span className="uppercase tracking-[0.08em] font-semibold text-[#713BDB] dark:text-[#A78BFA]">
                {quickViewProduct.category}
              </span>
              {badges.map((b) => (
                <span key={b} className="inline-flex items-center gap-2">
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[#24213A] dark:text-[#F4F2FF]">{b}</span>
                </span>
              ))}
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#24213A] dark:text-[#F4F2FF] pr-6">
              {quickViewProduct.name}
            </h2>

            <div className="flex items-center gap-2 text-xs text-[#5C577A] dark:text-[#B8B3D1]">
              <span className="inline-flex items-center gap-1 font-bold text-[#24213A] dark:text-[#F4F2FF] tabular-nums">
                <Star className="w-3.5 h-3.5 fill-[#FFC83D] text-[#FFC83D]" />
                {quickViewProduct.rating.toFixed(1)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{quickViewProduct.reviewCount} reviews</span>
            </div>

            <div className="flex items-baseline gap-2.5 tabular-nums">
              <span className="text-xl font-bold text-[#24213A] dark:text-[#F4F2FF]">
                {formatPkr(quickViewProduct.pricePkr)}
              </span>
              {quickViewProduct.originalPricePkr &&
                quickViewProduct.originalPricePkr > quickViewProduct.pricePkr && (
                  <>
                    <span className="text-xs text-[#8E89A8] line-through">
                      {formatPkr(quickViewProduct.originalPricePkr)}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#FFF0F2] dark:bg-[#FF626E]/15 text-[11px] font-bold text-[#FF626E]">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
            </div>

            <p className="text-xs sm:text-sm text-[#5C577A] dark:text-[#B8B3D1] line-clamp-3 leading-relaxed">
              {quickViewProduct.description}
            </p>

            {/* Colors */}
            {quickViewProduct.colors.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6589] dark:text-[#B8B3D1]">
                  Color: <span className="text-[#24213A] dark:text-[#F4F2FF]">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.colors.map((c) => {
                    const active = selectedColor === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                          active
                            ? 'border-[#713BDB] bg-[#F8F6FF] dark:bg-[#26223D] text-[#24213A] dark:text-[#F4F2FF]'
                            : 'border-[#713BDB]/15 dark:border-white/10 text-[#5C577A] dark:text-[#B8B3D1]'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/15"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6589] dark:text-[#B8B3D1]">
                  Size: <span className="text-[#24213A] dark:text-[#F4F2FF]">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickViewProduct.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[40px] px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                        selectedSize === s
                          ? 'bg-[#713BDB] text-white border-[#713BDB]'
                          : 'bg-white dark:bg-[#26223D] text-[#24213A] dark:text-[#F4F2FF] border-[#713BDB]/20 dark:border-white/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2 border-t border-[#713BDB]/10 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="inline-flex items-center border border-[#713BDB]/20 dark:border-white/15 rounded-xl bg-[#F8F6FF] dark:bg-[#26223D]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="p-2.5 text-[#5C577A] dark:text-[#B8B3D1] hover:text-[#713BDB]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-mono tabular-nums font-bold text-[#24213A] dark:text-[#F4F2FF]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  aria-label="Increase quantity"
                  className="p-2.5 text-[#5C577A] dark:text-[#B8B3D1] hover:text-[#713BDB]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-3 px-4 bg-[#713BDB] hover:bg-[#5E2EC4] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
              >
                Add to Cart · {formatPkr(quickViewProduct.pricePkr * quantity)}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(quickViewProduct)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                className={`p-3 rounded-xl border transition-colors ${
                  wishlisted
                    ? 'border-[#FF626E]/40 bg-[#FFF0F2] dark:bg-[#FF626E]/15 text-[#FF626E]'
                    : 'border-[#713BDB]/20 dark:border-white/15 text-[#5C577A] dark:text-[#B8B3D1]'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                const slug = quickViewProduct.slug;
                setQuickViewProduct(null);
                navigate('product', { slug });
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#713BDB] dark:text-[#A78BFA] hover:underline py-1"
            >
              <span>View Full Product Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
