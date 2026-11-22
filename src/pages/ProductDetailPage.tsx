import {
  ArrowLeft,
  Banknote,
  Check,
  Clock,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  Ruler,
  Star,
  Truck,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import { RecentlyViewedSection } from '../components/RecentlyViewedSection';
import {
  formatPkr,
  getDiscountPercent,
  getProductBadges,
  STORE_CONFIG,
} from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { catalogService } from '../services/catalogService';
import { buildWhatsAppUrl } from '../services/orderService';

export function ProductDetailPage() {
  const {
    activeProductSlug,
    navigate,
    addToCart,
    toggleWishlist,
    isInWishlist,
    recordProductView,
  } = useStore();
  const product = useMemo(
    () => (activeProductSlug ? catalogService.getProductBySlug(activeProductSlug) : undefined),
    [activeProductSlug]
  );

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setSelectedColor(product.colors[0]?.name || 'Standard');
      setSelectedSize(product.sizes ? product.sizes[0] : undefined);
      setQuantity(1);
      setShowSizeGuide(false);
      recordProductView(product.id);
    }
  }, [product, recordProductView]);

  if (!product) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-[#24213A] dark:text-[#F4F2FF]">
          Product not found
        </h1>
        <p className="text-sm text-[#5C577A] dark:text-[#B8B3D1] mt-2">
          The item you are looking for may have moved or been discontinued.
        </p>
        <button
          type="button"
          onClick={() => navigate('shop')}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#713BDB] text-white text-sm font-semibold rounded-xl hover:bg-[#5E2EC4]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shop</span>
        </button>
      </div>
    );
  }

  const discountPercent = getDiscountPercent(product.pricePkr, product.originalPricePkr);
  const relevantBadges = getProductBadges(product);
  const wishlisted = isInWishlist(product.id);
  const relatedProducts = catalogService.getRelatedProducts(product, 4);
  const productWhatsappUrl = buildWhatsAppUrl(
    `Hello ${STORE_CONFIG.brandName}, I have a question about "${product.name}" (SKU: ${product.sku}).`
  );

  const handleAddToCart = (goToCheckout = false) => {
    addToCart(product, {
      color: selectedColor,
      size: selectedSize,
      quantity,
      openDrawer: !goToCheckout,
    });
    if (goToCheckout) {
      navigate('checkout');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs text-[#5C577A] dark:text-[#B8B3D1] mb-8"
      >
        <button
          type="button"
          onClick={() => navigate('home')}
          className="hover:text-[#713BDB] dark:hover:text-[#A78BFA] transition-colors"
        >
          Home
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          onClick={() => navigate('shop', { category: product.category, collection: 'all' })}
          className="hover:text-[#713BDB] dark:hover:text-[#A78BFA] transition-colors"
        >
          {product.category}
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-[#24213A] dark:text-[#F4F2FF] font-semibold truncate">
          {product.name}
        </span>
      </nav>

      {/* Main 2-column PDP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Product Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white dark:bg-[#1C192E] border border-[#713BDB]/10 dark:border-white/10 shadow-sm">
            <ProductImage
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={`${product.name} — view ${selectedImageIndex + 1}`}
              title={product.name}
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  aria-label={`View image ${idx + 1} of ${product.name}`}
                  className={`aspect-[4/3] rounded-xl overflow-hidden bg-white dark:bg-[#1C192E] border transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#713BDB] ring-2 ring-[#713BDB]/30'
                      : 'border-[#713BDB]/15 dark:border-white/10 opacity-75 hover:opacity-100'
                  }`}
                >
                  <ProductImage
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Contiguous Sticky Purchase Module */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 bg-white dark:bg-[#1C192E] rounded-2xl border border-[#713BDB]/15 dark:border-white/10 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="space-y-2 border-b border-[#713BDB]/10 dark:border-white/10 pb-5">
            <div className="flex items-center justify-between gap-2 text-xs text-[#5C577A] dark:text-[#B8B3D1]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="uppercase tracking-[0.08em] font-semibold text-[#713BDB] dark:text-[#A78BFA]">
                  {product.category}
                </span>
                {relevantBadges.map((badge) => (
                  <span key={badge} className="inline-flex items-center gap-2">
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-semibold ${
                        badge === 'Sale'
                          ? 'text-[#FF626E]'
                          : badge === 'New Arrival'
                          ? 'text-[#0E7490] dark:text-[#28C5D7]'
                          : 'text-[#9A6B2F] dark:text-[#FFC83D]'
                      }`}
                    >
                      {badge}
                    </span>
                  </span>
                ))}
              </div>
              <span className="font-mono tabular-nums shrink-0 text-[#6B6589] dark:text-[#B8B3D1]">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#24213A] dark:text-[#F4F2FF] leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 pt-1 text-xs text-[#5C577A] dark:text-[#B8B3D1]">
              <span className="inline-flex items-center gap-1 font-bold text-[#24213A] dark:text-[#F4F2FF] tabular-nums">
                <Star className="w-3.5 h-3.5 fill-[#FFC83D] text-[#FFC83D]" />
                {product.rating.toFixed(1)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{product.reviewCount} verified reviews</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#166534] dark:text-emerald-400 font-semibold">In Stock</span>
            </div>

            <div className="pt-3 flex items-baseline gap-3 tabular-nums">
              <span className="text-2xl font-bold text-[#24213A] dark:text-[#F4F2FF]">
                {formatPkr(product.pricePkr)}
              </span>
              {product.originalPricePkr && product.originalPricePkr > product.pricePkr && (
                <>
                  <span className="text-sm text-[#8E89A8] line-through">
                    {formatPkr(product.originalPricePkr)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FFF0F2] dark:bg-[#FF626E]/15 text-xs font-bold text-[#FF626E]">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="text-sm text-[#5C577A] dark:text-[#B8B3D1] leading-relaxed">
            {product.description}
          </p>

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-[0.08em] text-[#6B6589] dark:text-[#B8B3D1]">
                  Color
                </span>
                <span className="font-semibold text-[#24213A] dark:text-[#F4F2FF]">
                  {selectedColor}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((color) => {
                  const active = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      aria-label={`Select color ${color.name}`}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                        active
                          ? 'border-[#713BDB] bg-[#F8F6FF] dark:bg-[#26223D] text-[#24213A] dark:text-[#F4F2FF]'
                          : 'border-[#713BDB]/15 dark:border-white/10 text-[#5C577A] dark:text-[#B8B3D1] hover:border-[#713BDB]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/15 dark:border-white/25"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector + Size Guide */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-[0.08em] text-[#6B6589] dark:text-[#B8B3D1]">
                  Size: <span className="text-[#24213A] dark:text-[#F4F2FF]">{selectedSize}</span>
                </span>
                {product.category === 'Apparel' && (
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide((v) => !v)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#713BDB] dark:text-[#A78BFA] hover:underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{showSizeGuide ? 'Hide Size Guide' : 'Size Guide'}</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={active}
                      className={`min-w-[48px] px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors ${
                        active
                          ? 'bg-[#713BDB] text-white border-[#713BDB]'
                          : 'bg-white dark:bg-[#26223D] text-[#24213A] dark:text-[#F4F2FF] border-[#713BDB]/20 dark:border-white/10 hover:border-[#713BDB]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {showSizeGuide && product.category === 'Apparel' && (
                <div className="p-3.5 rounded-xl bg-[#F8F6FF] dark:bg-[#26223D] border border-[#713BDB]/15 dark:border-white/10 text-xs">
                  <p className="font-bold text-[#24213A] dark:text-[#F4F2FF] mb-2">
                    Garment Measurements (Inches)
                  </p>
                  <div className="grid grid-cols-4 gap-2 text-center font-mono tabular-nums">
                    <span className="font-semibold text-[#5C577A] dark:text-[#B8B3D1]">Size</span>
                    <span className="font-semibold text-[#5C577A] dark:text-[#B8B3D1]">Chest</span>
                    <span className="font-semibold text-[#5C577A] dark:text-[#B8B3D1]">Length</span>
                    <span className="font-semibold text-[#5C577A] dark:text-[#B8B3D1]">Sleeve</span>
                    <span>S</span><span>40"</span><span>27.5"</span><span>24"</span>
                    <span>M</span><span>42"</span><span>28.5"</span><span>24.5"</span>
                    <span>L</span><span>44"</span><span>29.5"</span><span>25"</span>
                    <span>XL</span><span>46"</span><span>30.5"</span><span>25.5"</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center border border-[#713BDB]/20 dark:border-white/15 rounded-xl bg-[#F8F6FF] dark:bg-[#26223D]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="p-3 text-[#5C577A] dark:text-[#B8B3D1] hover:text-[#713BDB] dark:hover:text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-9 text-center text-sm font-mono tabular-nums font-bold text-[#24213A] dark:text-[#F4F2FF]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  aria-label="Increase quantity"
                  className="p-3 text-[#5C577A] dark:text-[#B8B3D1] hover:text-[#713BDB] dark:hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleAddToCart(false)}
                className="flex-1 py-3.5 px-5 bg-[#713BDB] text-white text-sm font-semibold rounded-xl hover:bg-[#5E2EC4] transition-colors shadow-xs"
              >
                Add to Cart · {formatPkr(product.pricePkr * quantity)}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-pressed={wishlisted}
                title={wishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
                className={`p-3.5 rounded-xl border transition-colors shrink-0 ${
                  wishlisted
                    ? 'border-[#FF626E]/40 bg-[#FFF0F2] dark:bg-[#FF626E]/15 text-[#FF626E]'
                    : 'border-[#713BDB]/20 dark:border-white/15 bg-white dark:bg-[#26223D] text-[#5C577A] dark:text-[#B8B3D1] hover:border-[#713BDB] hover:text-[#713BDB]'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleAddToCart(true)}
              className="w-full py-3 px-6 bg-[#FFC83D] text-[#24213A] text-sm font-bold rounded-xl hover:bg-[#FFD363] transition-colors"
            >
              Buy Now with Cash on Delivery
            </button>
          </div>

          {/* Specifications */}
          <div className="pt-4 border-t border-[#713BDB]/10 dark:border-white/10 space-y-2.5">
            <h2 className="text-xs uppercase tracking-[0.08em] font-bold text-[#24213A] dark:text-[#F4F2FF]">
              Craft & Specifications
            </h2>
            <ul className="space-y-2 text-sm text-[#5C577A] dark:text-[#B8B3D1]">
              {product.details.map((detail) => (
                <li key={detail} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#713BDB] dark:text-[#A78BFA] shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Delivery Information */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#F8F6FF] dark:bg-[#26223D] border border-[#713BDB]/15 dark:border-white/10 space-y-3 text-xs text-[#5C577A] dark:text-[#B8B3D1]">
            <p className="text-[11px] uppercase tracking-[0.08em] font-bold text-[#713BDB] dark:text-[#A78BFA]">
              Delivery & Order Information
            </p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#713BDB] dark:text-[#A78BFA] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#24213A] dark:text-[#F4F2FF]">
                    Estimated Delivery:{' '}
                  </span>
                  <span>{STORE_CONFIG.estimatedDeliveryWindow}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Banknote className="w-4 h-4 text-[#713BDB] dark:text-[#A78BFA] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#24213A] dark:text-[#F4F2FF]">
                    Cash on Delivery:{' '}
                  </span>
                  <span>Available nationwide — pay in cash at your doorstep</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#713BDB] dark:text-[#A78BFA] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#24213A] dark:text-[#F4F2FF]">
                    Shipping:{' '}
                  </span>
                  <span>
                    Free on orders above {formatPkr(STORE_CONFIG.freeShippingThresholdPkr)}{' '}
                    (otherwise {formatPkr(STORE_CONFIG.standardShippingFeePkr)} flat rate)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[#713BDB]/10 dark:border-white/10">
              <a
                href={productWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#166534] dark:text-emerald-400 hover:underline underline-offset-4"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Ask about this product on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-16 pt-12 border-t border-[#713BDB]/15 dark:border-white/10">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[#713BDB] dark:text-[#A78BFA] font-bold">
              You May Also Like
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#24213A] dark:text-[#F4F2FF] mt-1">
              Related Pieces
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('shop')}
            className="text-sm font-semibold text-[#713BDB] dark:text-[#A78BFA] hover:underline underline-offset-4"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <div className="mt-12">
        <RecentlyViewedSection excludeProductId={product.id} />
      </div>
    </div>
  );
}
