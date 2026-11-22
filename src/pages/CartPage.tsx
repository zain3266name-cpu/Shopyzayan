import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { ProductImage } from '../components/ProductImage';
import { formatPkr, STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';

export function CartPage() {
  const {
    cart,
    cartTotals,
    promoCode,
    applyPromoCode,
    removePromoCode,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    navigate,
  } = useStore();
  const [promoInput, setPromoInput] = useState(promoCode);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyPromoCode(promoInput);
    if (ok) {
      setPromoInput(promoInput.trim().toUpperCase());
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex items-end justify-between gap-4 pb-6 border-b border-[#713BDB]/15 dark:border-white/10">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[#713BDB] dark:text-[#A78BFA] font-bold">
            Review
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#24213A] dark:text-[#F4F2FF] mt-1">
            Shopping Cart
          </h1>
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-[#FF626E] hover:underline transition-colors"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#1C192E] border border-[#713BDB]/15 dark:border-white/10 shadow-xs flex items-center justify-center text-[#713BDB] dark:text-[#A78BFA] mx-auto mb-5">
            <ShoppingBag className="w-7 h-7 stroke-[1.75]" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#24213A] dark:text-[#F4F2FF]">
            Your shopping cart is empty
          </h2>
          <p className="text-sm text-[#5C577A] dark:text-[#B8B3D1] mt-2">
            Discover our watches, leather bags, apparel, and fragrances with Cash on Delivery
            across Pakistan.
          </p>
          <button
            type="button"
            onClick={() => navigate('shop')}
            className="mt-7 inline-flex items-center gap-2 px-6 py-3 bg-[#713BDB] text-white text-sm font-semibold rounded-xl hover:bg-[#5E2EC4] transition-colors"
          >
            <span>Explore Shop</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 bg-white dark:bg-[#1C192E] rounded-2xl border border-[#713BDB]/10 dark:border-white/10 p-5 sm:p-6 shadow-xs">
            <ul className="divide-y divide-[#713BDB]/10 dark:divide-white/10">
              {cart.map((item) => (
                <li key={item.key} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5">
                  <button
                    type="button"
                    onClick={() => navigate('product', { slug: item.slug })}
                    className="w-full sm:w-32 aspect-[4/3] rounded-xl overflow-hidden bg-[#F1EEFC] dark:bg-[#26223D] border border-[#713BDB]/10 dark:border-white/10 shrink-0"
                  >
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      title={item.name}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  <div className="flex-1 flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.08em] text-[#713BDB] dark:text-[#A78BFA] font-semibold">
                          {item.category} · {item.sku}
                        </p>
                        <button
                          type="button"
                          onClick={() => navigate('product', { slug: item.slug })}
                          className="text-base font-bold text-[#24213A] dark:text-[#F4F2FF] hover:text-[#713BDB] dark:hover:text-[#A78BFA] text-left mt-0.5 transition-colors"
                        >
                          {item.name}
                        </button>
                        <p className="text-xs text-[#5C577A] dark:text-[#B8B3D1] mt-1">
                          {[item.selectedColor, item.selectedSize].filter(Boolean).join(' · ')}
                        </p>
                      </div>

                      <p className="text-base font-bold text-[#24213A] dark:text-[#F4F2FF] tabular-nums shrink-0">
                        {formatPkr(item.pricePkr * item.quantity)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#713BDB]/20 dark:border-white/15 rounded-xl bg-[#F8F6FF] dark:bg-[#26223D]">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.key, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="p-2 text-[#5C577A] dark:text-[#B8B3D1] hover:text-[#713BDB] dark:hover:text-[#A78BFA] transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-sm font-mono tabular-nums font-bold text-[#24213A] dark:text-[#F4F2FF]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.key, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="p-2 text-[#5C577A] dark:text-[#B8B3D1] hover:text-[#713BDB] dark:hover:text-[#A78BFA] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.key)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6589] dark:text-[#B8B3D1] hover:text-[#FF626E] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => navigate('shop')}
              className="mt-6 pt-5 border-t border-[#713BDB]/10 dark:border-white/10 w-full inline-flex items-center gap-2 text-sm font-semibold text-[#713BDB] dark:text-[#A78BFA] hover:underline underline-offset-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-4 rounded-2xl border border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] p-6 shadow-xs space-y-5 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-bold text-[#24213A] dark:text-[#F4F2FF]">
              Order Summary
            </h2>

            {/* Promo Code Input */}
            <div className="space-y-2 pb-4 border-b border-[#713BDB]/10 dark:border-white/10">
              <label
                htmlFor="cart-promo"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5C577A] dark:text-[#B8B3D1]"
              >
                <Tag className="w-3.5 h-3.5 text-[#713BDB] dark:text-[#A78BFA]" />
                <span>Promo Code</span>
              </label>

              {cartTotals.appliedPromoCode ? (
                <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#F4FBF7] dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30">
                  <div className="text-xs">
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                      {cartTotals.appliedPromoCode}
                    </span>
                    <span className="text-[#5C577A] dark:text-[#B8B3D1] ml-2">applied</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removePromoCode();
                      setPromoInput('');
                    }}
                    aria-label="Remove promo code"
                    className="p-1 text-[#5C577A] dark:text-[#B8B3D1] hover:text-[#FF626E] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    id="cart-promo"
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Try ZAYN10 or FREESHIP"
                    className="flex-1 min-w-0 px-3 py-2 text-xs uppercase rounded-xl border border-[#713BDB]/20 dark:border-white/15 bg-[#F8F6FF] dark:bg-[#26223D] text-[#24213A] dark:text-[#F4F2FF] placeholder:normal-case placeholder:text-[#8E89A8] focus:outline-none focus:border-[#713BDB]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#24213A] dark:bg-[#713BDB] text-white text-xs font-semibold rounded-xl hover:bg-[#713BDB] dark:hover:bg-[#5E2EC4] transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}
              <p className="text-[11px] text-[#6B6589] dark:text-[#9892B8]">
                Use <span className="font-mono font-semibold text-[#713BDB] dark:text-[#A78BFA]">ZAYN10</span> for 10% off or{' '}
                <span className="font-mono font-semibold text-[#713BDB] dark:text-[#A78BFA]">FREESHIP</span> for free delivery.
              </p>
            </div>

            <div className="space-y-3 text-sm border-b border-[#713BDB]/10 dark:border-white/10 pb-4">
              <div className="flex items-center justify-between text-[#5C577A] dark:text-[#B8B3D1]">
                <span>Items ({cartTotals.itemCount})</span>
                <span className="font-semibold text-[#24213A] dark:text-[#F4F2FF] tabular-nums">
                  {formatPkr(cartTotals.subtotalPkr)}
                </span>
              </div>
              {cartTotals.discountPkr > 0 && cartTotals.appliedPromoCode && (
                <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
                  <span>Promo ({cartTotals.appliedPromoCode})</span>
                  <span className="font-semibold tabular-nums">
                    -{formatPkr(cartTotals.discountPkr)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-[#5C577A] dark:text-[#B8B3D1]">
                <span>Nationwide Delivery (COD)</span>
                <span className="font-semibold text-[#24213A] dark:text-[#F4F2FF] tabular-nums">
                  {cartTotals.shippingPkr === 0 ? 'Free' : formatPkr(cartTotals.shippingPkr)}
                </span>
              </div>
              {cartTotals.shippingPkr > 0 && (
                <p className="text-xs text-[#6B6589] dark:text-[#9892B8]">
                  Free shipping on orders above{' '}
                  <span className="tabular-nums font-semibold text-[#713BDB] dark:text-[#A78BFA]">
                    {formatPkr(STORE_CONFIG.freeShippingThresholdPkr)}
                  </span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-base font-bold text-[#24213A] dark:text-[#F4F2FF]">
              <span>Total</span>
              <span className="tabular-nums text-[#713BDB] dark:text-[#A78BFA]">
                {formatPkr(cartTotals.totalPkr)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate('checkout')}
              className="w-full py-3.5 px-5 bg-[#713BDB] text-white text-sm font-semibold rounded-xl hover:bg-[#5E2EC4] transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
