import { Heart, ShoppingBag } from 'lucide-react';
import { formatPkr, getDiscountPercent, getPrimaryProductBadge } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { navigate, addToCart, toggleWishlist, isInWishlist } = useStore();
  const displayTag = getPrimaryProductBadge(product);
  const discountPercent = getDiscountPercent(product.pricePkr, product.originalPricePkr);
  const wishlisted = isInWishlist(product.id);

  const badgeStyle =
    displayTag === 'Sale'
      ? 'bg-[#FF626E] text-white'
      : displayTag === 'New Arrival'
      ? 'bg-[#28C5D7] text-[#24213A]'
      : 'bg-[#FFC83D] text-[#24213A]';

  return (
    <article className="group h-full flex flex-col bg-white rounded-2xl border border-[#713BDB]/10 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
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

        {displayTag && (
          <span
            className={`pointer-events-none absolute top-2.5 left-2.5 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold tracking-wide rounded-md shadow-xs ${badgeStyle}`}
          >
            {displayTag === 'Sale' && discountPercent > 0 ? `-${discountPercent}%` : displayTag}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs shadow-xs border border-black/5 flex items-center justify-center transition-colors ${
            wishlisted ? 'text-[#FF626E]' : 'text-[#5C577A] hover:text-[#713BDB]'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-3.5 sm:p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.07em] text-[#6B6589] font-semibold truncate">
            {product.category}
          </span>
          {product.colors.length > 1 && (
            <div className="hidden sm:flex items-center gap-1 shrink-0" aria-label={`${product.colors.length} color options`}>
              {product.colors.slice(0, 3).map((c) => (
                <span
                  key={c.name}
                  className="w-2.5 h-2.5 rounded-full border border-black/15"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate('product', { slug: product.slug })}
          className="text-left text-[13px] sm:text-[15px] font-semibold text-[#24213A] hover:text-[#713BDB] transition-colors line-clamp-2 leading-snug focus-visible:outline-2 focus-visible:outline-[#713BDB] rounded-xs"
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
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, { openDrawer: true });
            }}
            className="w-full inline-flex items-center justify-center gap-1.5 bg-[#713BDB] hover:bg-[#5E2EC4] text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors whitespace-nowrap"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </article>
  );
}
