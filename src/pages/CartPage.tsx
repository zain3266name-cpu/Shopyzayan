import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { ProductImage } from '../components/ProductImage';
import { formatPkr, STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';

export function CartPage() {
  const { cart, cartTotals, updateCartQuantity, removeFromCart, clearCart, navigate } = useStore();

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex items-end justify-between gap-4 pb-6 border-b border-[#713BDB]/15">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[#713BDB] font-bold">Review</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#24213A] mt-1">
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
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#713BDB]/15 shadow-xs flex items-center justify-center text-[#713BDB] mx-auto mb-5">
            <ShoppingBag className="w-7 h-7 stroke-[1.75]" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#24213A]">
            Your shopping cart is empty
          </h2>
          <p className="text-sm text-[#5C577A] mt-2">
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
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#713BDB]/10 p-5 sm:p-6 shadow-xs">
            <ul className="divide-y divide-[#713BDB]/10">
              {cart.map((item) => (
                <li key={item.key} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5">
                  <button
                    type="button"
                    onClick={() => navigate('product', { slug: item.slug })}
                    className="w-full sm:w-32 aspect-[4/3] rounded-xl overflow-hidden bg-[#F1EEFC] border border-[#713BDB]/10 shrink-0"
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
                        <p className="text-[11px] uppercase tracking-[0.08em] text-[#713BDB] font-semibold">
                          {item.category} · {item.sku}
                        </p>
                        <button
                          type="button"
                          onClick={() => navigate('product', { slug: item.slug })}
                          className="text-base font-bold text-[#24213A] hover:text-[#713BDB] text-left mt-0.5 transition-colors"
                        >
                          {item.name}
                        </button>
                        <p className="text-xs text-[#5C577A] mt-1">
                          {[item.selectedColor, item.selectedSize].filter(Boolean).join(' · ')}
                        </p>
                      </div>

                      <p className="text-base font-bold text-[#24213A] tabular-nums shrink-0">
                        {formatPkr(item.pricePkr * item.quantity)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#713BDB]/20 rounded-xl bg-[#F8F6FF]">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.key, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="p-2 text-[#5C577A] hover:text-[#713BDB] transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-sm font-mono tabular-nums font-bold text-[#24213A]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.key, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="p-2 text-[#5C577A] hover:text-[#713BDB] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.key)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6589] hover:text-[#FF626E] transition-colors"
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
              className="mt-6 pt-5 border-t border-[#713BDB]/10 w-full inline-flex items-center gap-2 text-sm font-semibold text-[#713BDB] hover:underline underline-offset-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-4 rounded-2xl border border-[#713BDB]/15 bg-white p-6 shadow-xs space-y-5 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-bold text-[#24213A]">Order Summary</h2>

            <div className="space-y-3 text-sm border-b border-[#713BDB]/10 pb-4">
              <div className="flex items-center justify-between text-[#5C577A]">
                <span>Items ({cartTotals.itemCount})</span>
                <span className="font-semibold text-[#24213A] tabular-nums">
                  {formatPkr(cartTotals.subtotalPkr)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#5C577A]">
                <span>Nationwide Delivery (COD)</span>
                <span className="font-semibold text-[#24213A] tabular-nums">
                  {cartTotals.shippingPkr === 0 ? 'Free' : formatPkr(cartTotals.shippingPkr)}
                </span>
              </div>
              {cartTotals.shippingPkr > 0 && (
                <p className="text-xs text-[#6B6589]">
                  Free shipping on orders above{' '}
                  <span className="tabular-nums font-semibold text-[#713BDB]">
                    {formatPkr(STORE_CONFIG.freeShippingThresholdPkr)}
                  </span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-base font-bold text-[#24213A]">
              <span>Total</span>
              <span className="tabular-nums text-[#713BDB]">{formatPkr(cartTotals.totalPkr)}</span>
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
