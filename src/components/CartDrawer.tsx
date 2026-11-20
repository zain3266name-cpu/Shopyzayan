import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import { formatPkr, STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { ProductImage } from './ProductImage';

export function CartDrawer() {
  const {
    cart,
    cartTotals,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    navigate,
  } = useStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(
    0,
    STORE_CONFIG.freeShippingThresholdPkr - cartTotals.subtotalPkr
  );
  const freeShippingProgress = Math.min(
    100,
    Math.round((cartTotals.subtotalPkr / STORE_CONFIG.freeShippingThresholdPkr) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-[#24213A]/45 backdrop-blur-[2px] transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag"
        className="relative z-10 w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-[#713BDB]/15"
      >
        <div className="px-6 py-4 border-b border-[#713BDB]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-lg font-bold text-[#24213A]">Shopping Cart</h2>
            <span className="text-xs font-mono tabular-nums px-2 py-0.5 rounded-md bg-[#F8F6FF] text-[#713BDB] font-semibold">
              {cartTotals.itemCount}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close shopping bag"
            className="p-2 text-[#5C577A] hover:text-[#24213A] hover:bg-[#F8F6FF] rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {cart.length > 0 && (
          <div className="px-6 py-3 bg-[#F8F6FF] border-b border-[#713BDB]/10">
            <p className="text-xs text-[#24213A] mb-2">
              {remainingForFreeShipping === 0 ? (
                <span className="font-semibold text-[#713BDB]">
                  Complimentary nationwide Cash on Delivery unlocked.
                </span>
              ) : (
                <>
                  Add{' '}
                  <span className="font-bold text-[#713BDB] tabular-nums">
                    {formatPkr(remainingForFreeShipping)}
                  </span>{' '}
                  more for free nationwide delivery.
                </>
              )}
            </p>
            <div className="w-full h-2 bg-[#E8E2FA] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#713BDB] to-[#FF626E] transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-[#F8F6FF] border border-[#713BDB]/15 flex items-center justify-center text-[#713BDB] mb-4">
                <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#24213A]">Your cart is empty</h3>
              <p className="text-sm text-[#5C577A] mt-1.5 max-w-[260px]">
                Explore our curated essentials with nationwide Cash on Delivery across Pakistan.
              </p>
              <button
                type="button"
                onClick={() => navigate('shop')}
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-[#713BDB] text-white text-sm font-semibold rounded-xl hover:bg-[#5E2EC4] transition-colors"
              >
                <span>Browse Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[#713BDB]/10">
              {cart.map((item) => (
                <li key={item.key} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('product', { slug: item.slug })}
                    className="w-20 h-20 rounded-xl overflow-hidden bg-[#F1EEFC] border border-[#713BDB]/10 shrink-0"
                  >
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      title={item.name}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => navigate('product', { slug: item.slug })}
                          className="text-sm font-semibold text-[#24213A] hover:text-[#713BDB] text-left line-clamp-1 transition-colors"
                        >
                          {item.name}
                        </button>
                        <p className="text-xs text-[#6B6589] mt-0.5">
                          {[item.selectedColor, item.selectedSize].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.key)}
                        aria-label={`Remove ${item.name}`}
                        className="text-[#8E89A8] hover:text-[#FF626E] p-1 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-[#713BDB]/20 rounded-xl bg-[#F8F6FF]">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.key, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="p-1.5 text-[#5C577A] hover:text-[#713BDB] transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-mono tabular-nums font-semibold text-[#24213A]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.key, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="p-1.5 text-[#5C577A] hover:text-[#713BDB] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#24213A] tabular-nums">
                        {formatPkr(item.pricePkr * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-[#713BDB]/10 bg-[#F8F6FF] space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-[#5C577A]">
                <span>Subtotal</span>
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
              <div className="flex items-center justify-between pt-2 border-t border-[#713BDB]/10 text-base font-bold text-[#24213A]">
                <span>Estimated Total</span>
                <span className="tabular-nums text-[#713BDB]">
                  {formatPkr(cartTotals.totalPkr)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => navigate('checkout')}
                className="w-full py-3.5 px-4 bg-[#713BDB] text-white text-sm font-semibold rounded-xl hover:bg-[#5E2EC4] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('cart')}
                className="w-full py-2.5 px-4 bg-white border border-[#713BDB]/20 text-[#24213A] text-xs font-semibold rounded-xl hover:border-[#713BDB] transition-colors"
              >
                View Full Cart
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
