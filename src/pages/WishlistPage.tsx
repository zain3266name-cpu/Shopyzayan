import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { ProductImage } from '../components/ProductImage';
import { formatPkr, getDiscountPercent, getPrimaryProductBadge } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';

export function WishlistPage() {
  const {
    wishlistProducts,
    toggleWishlist,
    clearWishlist,
    addToCart,
    navigate,
  } = useStore();

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#713BDB]/15">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[#FF626E] font-bold">
            Saved Items
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#24213A] mt-1">
            Wishlist
          </h1>
        </div>
        {wishlistProducts.length > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#5C577A] tabular-nums">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
            </span>
            <button
              type="button"
              onClick={clearWishlist}
              className="text-xs font-semibold text-[#FF626E] hover:underline transition-colors"
            >
              Clear Wishlist
            </button>
          </div>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#713BDB]/15 shadow-xs flex items-center justify-center text-[#FF626E] mx-auto mb-5">
            <Heart className="w-7 h-7 stroke-[1.75]" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#24213A]">Your wishlist is empty</h2>
          <p className="text-sm text-[#5C577A] mt-2">
            Tap the heart icon on any product to save favorites here for quick access later.
          </p>
          <button
            type="button"
            onClick={() => navigate('shop', { category: 'All', collection: 'all' })}
            className="mt-7 inline-flex items-center gap-2 px-6 py-3 bg-[#713BDB] text-white text-sm font-semibold rounded-xl hover:bg-[#5E2EC4] transition-colors"
          >
            <span>Explore Shop</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {wishlistProducts.map((product) => {
            const badge = getPrimaryProductBadge(product);
            const discountPercent = getDiscountPercent(product.pricePkr, product.originalPricePkr);
            const badgeStyle =
              badge === 'Sale'
                ? 'bg-[#FF626E] text-white'
                : badge === 'New Arrival'
                ? 'bg-[#28C5D7] text-[#24213A]'
                : 'bg-[#FFC83D] text-[#24213A]';

            return (
              <article
                key={product.id}
                className="group h-full flex flex-col bg-white rounded-2xl border border-[#713BDB]/10 shadow-xs hover:shadow-md transition-all overflow-hidden"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F1EEFC]">
                  <button
                    type="button"
                    onClick={() => navigate('product', { slug: product.slug })}
                    className="block w-full h-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#713BDB]"
                    aria-label={`View ${product.name}`}
                  >
                    <ProductImage
                      src={product.images[0]}
                      alt={product.name}
                      title={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                  </button>

                  {badge && (
                    <span
                      className={`pointer-events-none absolute top-2.5 left-2.5 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold tracking-wide rounded-md shadow-xs ${badgeStyle}`}
                    >
                      {badge === 'Sale' && discountPercent > 0 ? `-${discountPercent}%` : badge}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    title="Remove from wishlist"
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs border border-black/5 flex items-center justify-center text-[#5C577A] hover:text-[#FF626E] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3.5 sm:p-4 flex flex-col gap-2 flex-1">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.07em] text-[#6B6589] font-semibold truncate">
                    {product.category}
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate('product', { slug: product.slug })}
                    className="text-left text-[13px] sm:text-[15px] font-semibold text-[#24213A] hover:text-[#713BDB] line-clamp-2 leading-snug"
                  >
                    {product.name}
                  </button>

                  <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 tabular-nums">
                    <span className="text-sm sm:text-base font-bold text-[#24213A]">
                      {formatPkr(product.pricePkr)}
                    </span>
                    {product.originalPricePkr && product.originalPricePkr > product.pricePkr && (
                      <span className="text-[11px] sm:text-xs text-[#8E89A8] line-through">
                        {formatPkr(product.originalPricePkr)}
                      </span>
                    )}
                  </div>

                  <div className="pt-1.5 mt-auto">
                    <button
                      type="button"
                      onClick={() => addToCart(product, { openDrawer: true })}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#713BDB] text-white text-xs font-semibold rounded-xl hover:bg-[#5E2EC4] transition-colors whitespace-nowrap"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
