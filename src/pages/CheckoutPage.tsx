import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageCircle,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { useState } from 'react';
import { ProductImage } from '../components/ProductImage';
import { formatPkr, STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { orderService } from '../services/orderService';
import { CheckoutFormData, OrderRecord } from '../types/store';

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  city?: string;
  customCity?: string;
  address?: string;
}

export function CheckoutPage() {
  const { cart, cartTotals, clearCart, navigate, showToast, lastOrder, setLastOrder } = useStore();

  const [form, setForm] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Lahore',
    notes: '',
    paymentMethod: 'COD',
  });
  const [customCity, setCustomCity] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedOrder, setSubmittedOrder] = useState<OrderRecord | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 3) {
      nextErrors.fullName = 'Please enter your full name (at least 3 characters).';
    }

    const cleanPhone = form.phone.replace(/[\s\-()]/g, '');
    if (!cleanPhone || !/^(\+?92|0)?3\d{9}$/.test(cleanPhone)) {
      nextErrors.phone = 'Enter a valid Pakistani mobile number (e.g., 0300-1234567).';
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address or leave this field blank.';
    }

    if (form.city === 'Other' && !customCity.trim()) {
      nextErrors.customCity = 'Please specify your city name.';
    }

    if (!form.address.trim() || form.address.trim().length < 10) {
      nextErrors.address = 'Please provide your complete street, house/apartment, and sector/area.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Your bag is empty', 'Add items before placing an order.', 'error');
      return;
    }

    if (!validate()) {
      showToast('Check your details', 'Please correct the highlighted fields below.', 'error');
      return;
    }

    const resolvedCity = form.city === 'Other' ? customCity.trim() : form.city;
    const prepared = orderService.prepareWhatsAppOrder(
      { ...form, city: resolvedCity },
      cart
    );

    setSubmittedOrder(prepared);
    setLastOrder(prepared);
    clearCart();
    showToast('Order prepared for WhatsApp', `Reference ${prepared.orderNumber} is ready to send.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyMessage = async (message: string) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedMessage(true);
      showToast('Copied to clipboard', 'Order details copied. You can paste them into WhatsApp.');
      window.setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      showToast('Unable to copy', 'Please use the Send to WhatsApp button directly.', 'info');
    }
  };

  const activeReceipt = submittedOrder;
  if (activeReceipt) {
    return (
      <div className="max-w-[820px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="rounded-2xl border border-[#713BDB]/15 bg-white shadow-sm p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#713BDB]/10">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-[#713BDB] font-bold">
                  Cash on Delivery Order Prepared
                </p>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#24213A] mt-0.5">
                  Order {activeReceipt.orderNumber}
                </h1>
              </div>
            </div>
            <span className="text-xs font-mono tabular-nums text-[#5C577A]">
              {new Date(activeReceipt.createdAtIso).toLocaleDateString('en-PK', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          {/* Primary WhatsApp Dispatch Card */}
          <div className="rounded-2xl bg-[#F4FBF7] border border-emerald-200 p-5 sm:p-6 space-y-4">
            <div className="space-y-1.5">
              <h2 className="font-display text-lg font-bold text-[#24213A]">
                Send Your Order Details to Our WhatsApp
              </h2>
              <p className="text-sm text-[#5C577A] leading-relaxed">
                Click the button below to open WhatsApp with your complete order summary pre-filled
                for dispatch to <span className="font-bold text-[#24213A]">{STORE_CONFIG.brandName}</span> (
                <span className="font-mono text-xs">{STORE_CONFIG.whatsappDisplay}</span>). Your
                order is confirmed once sent on WhatsApp.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a
                href={activeReceipt.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#166534] text-white text-sm font-semibold rounded-xl hover:bg-[#14532D] transition-colors whitespace-nowrap shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Order Details on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <button
                type="button"
                onClick={() => handleCopyMessage(activeReceipt.whatsappMessage)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-[#713BDB]/20 text-[#24213A] text-sm font-semibold rounded-xl hover:border-[#713BDB] transition-colors whitespace-nowrap"
              >
                {copiedMessage ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Order Message</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Customer & Item Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-[0.08em] font-bold text-[#713BDB]">
                Delivery Destination
              </p>
              <p className="font-bold text-[#24213A]">{activeReceipt.customer.fullName}</p>
              <p className="text-[#5C577A] font-mono text-xs">{activeReceipt.customer.phone}</p>
              {activeReceipt.customer.email && (
                <p className="text-[#5C577A]">{activeReceipt.customer.email}</p>
              )}
              <p className="text-[#5C577A]">{activeReceipt.customer.address}</p>
              <p className="text-[#5C577A]">{activeReceipt.customer.city}, Pakistan</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-[0.08em] font-bold text-[#713BDB]">
                Payment & Totals
              </p>
              <p className="text-[#24213A]">Method: Cash on Delivery (COD)</p>
              <p className="text-[#5C577A] tabular-nums">
                Subtotal: {formatPkr(activeReceipt.subtotalPkr)}
              </p>
              <p className="text-[#5C577A] tabular-nums">
                Delivery:{' '}
                {activeReceipt.shippingPkr === 0 ? 'Free' : formatPkr(activeReceipt.shippingPkr)}
              </p>
              <p className="font-bold text-[#713BDB] text-base pt-1 tabular-nums">
                Total Payable: {formatPkr(activeReceipt.totalPkr)}
              </p>
            </div>
          </div>

          {/* Itemized list */}
          <div className="border-t border-[#713BDB]/10 pt-5 space-y-3">
            <p className="text-xs uppercase tracking-[0.08em] font-bold text-[#6B6589]">
              Items ({activeReceipt.items.reduce((s, i) => s + i.quantity, 0)})
            </p>
            <ul className="divide-y divide-[#713BDB]/10">
              {activeReceipt.items.map((item) => (
                <li key={item.key} className="py-2.5 flex items-center justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#24213A] truncate">
                      {item.name} × {item.quantity}
                    </p>
                    <p className="text-xs text-[#5C577A]">
                      {[item.selectedColor, item.selectedSize].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <span className="font-bold text-[#24213A] tabular-nums shrink-0">
                    {formatPkr(item.pricePkr * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <details className="border-t border-[#713BDB]/10 pt-4">
            <summary className="text-xs font-semibold text-[#5C577A] hover:text-[#713BDB] cursor-pointer select-none">
              Preview formatted WhatsApp message
            </summary>
            <pre className="mt-3 p-4 rounded-xl bg-[#F8F6FF] text-xs font-mono text-[#24213A] whitespace-pre-wrap overflow-x-auto border border-[#713BDB]/15">
              {activeReceipt.whatsappMessage}
            </pre>
          </details>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setSubmittedOrder(null);
                navigate('shop');
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#713BDB] hover:underline underline-offset-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white border border-[#713BDB]/15 shadow-xs flex items-center justify-center text-[#713BDB] mx-auto mb-5">
          <ShoppingBag className="w-7 h-7 stroke-[1.75]" />
        </div>
        <h1 className="font-display text-3xl font-bold text-[#24213A]">Your cart is empty</h1>
        <p className="text-sm text-[#5C577A] mt-2">
          Add items to your shopping cart before proceeding to checkout.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('shop')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#713BDB] text-white text-sm font-semibold rounded-xl hover:bg-[#5E2EC4] transition-colors"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          {lastOrder && (
            <button
              type="button"
              onClick={() => setSubmittedOrder(lastOrder)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-[#713BDB]/20 text-[#24213A] text-sm font-semibold rounded-xl hover:border-[#713BDB] transition-colors"
            >
              <span>View Last Prepared Order ({lastOrder.orderNumber})</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="pb-6 border-b border-[#713BDB]/15 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-[#713BDB] font-bold">
            Cash on Delivery
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#24213A] mt-1">
            Checkout
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('cart')}
          className="text-xs font-semibold text-[#713BDB] hover:underline underline-offset-4"
        >
          Edit Cart
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <form
          onSubmit={handlePlaceOrder}
          noValidate
          className="lg:col-span-7 bg-white rounded-2xl border border-[#713BDB]/10 p-6 sm:p-8 shadow-xs space-y-6"
        >
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-[#24213A]">
              Customer & Delivery Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-[#24213A] mb-1.5">
                  Full Name <span className="text-[#FF626E]">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => {
                    setForm({ ...form, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                  }}
                  placeholder="Zain Raza"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[#F8F6FF] text-[#24213A] focus:bg-white focus:outline-none ${
                    errors.fullName
                      ? 'border-[#FF626E]'
                      : 'border-[#713BDB]/20 focus:border-[#713BDB]'
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-[#FF626E]">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-[#24213A] mb-1.5">
                  Mobile Number (WhatsApp) <span className="text-[#FF626E]">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  placeholder="0300-1234567"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[#F8F6FF] text-[#24213A] focus:bg-white focus:outline-none ${
                    errors.phone
                      ? 'border-[#FF626E]'
                      : 'border-[#713BDB]/20 focus:border-[#713BDB]'
                  }`}
                />
                {errors.phone && <p className="mt-1 text-xs text-[#FF626E]">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-[#24213A] mb-1.5">
                  Email <span className="text-[#8E89A8]">(Optional)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="you@example.com"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[#F8F6FF] text-[#24213A] focus:bg-white focus:outline-none ${
                    errors.email
                      ? 'border-[#FF626E]'
                      : 'border-[#713BDB]/20 focus:border-[#713BDB]'
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs text-[#FF626E]">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="city" className="block text-xs font-semibold text-[#24213A] mb-1.5">
                  City <span className="text-[#FF626E]">*</span>
                </label>
                <select
                  id="city"
                  value={form.city}
                  onChange={(e) => {
                    setForm({ ...form, city: e.target.value });
                    if (errors.customCity) setErrors({ ...errors, customCity: undefined });
                  }}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#713BDB]/20 bg-[#F8F6FF] text-[#24213A] focus:bg-white focus:outline-none focus:border-[#713BDB]"
                >
                  {STORE_CONFIG.pakistaniCities.map((cityName) => (
                    <option key={cityName} value={cityName}>
                      {cityName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {form.city === 'Other' && (
              <div>
                <label
                  htmlFor="customCity"
                  className="block text-xs font-semibold text-[#24213A] mb-1.5"
                >
                  Specify City <span className="text-[#FF626E]">*</span>
                </label>
                <input
                  id="customCity"
                  type="text"
                  value={customCity}
                  onChange={(e) => {
                    setCustomCity(e.target.value);
                    if (errors.customCity) setErrors({ ...errors, customCity: undefined });
                  }}
                  placeholder="Enter your city name"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[#F8F6FF] text-[#24213A] focus:bg-white focus:outline-none ${
                    errors.customCity
                      ? 'border-[#FF626E]'
                      : 'border-[#713BDB]/20 focus:border-[#713BDB]'
                  }`}
                />
                {errors.customCity && (
                  <p className="mt-1 text-xs text-[#FF626E]">{errors.customCity}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="address" className="block text-xs font-semibold text-[#24213A] mb-1.5">
                Complete Street Address <span className="text-[#FF626E]">*</span>
              </label>
              <textarea
                id="address"
                rows={3}
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => {
                  setForm({ ...form, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: undefined });
                }}
                placeholder="House / Flat No., Street, Sector / Phase / Block, Landmark"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[#F8F6FF] text-[#24213A] focus:bg-white focus:outline-none ${
                  errors.address
                    ? 'border-[#FF626E]'
                    : 'border-[#713BDB]/20 focus:border-[#713BDB]'
                }`}
              />
              {errors.address && <p className="mt-1 text-xs text-[#FF626E]">{errors.address}</p>}
            </div>

            <div>
              <label htmlFor="notes" className="block text-xs font-semibold text-[#24213A] mb-1.5">
                Delivery Instructions <span className="text-[#8E89A8]">(Optional)</span>
              </label>
              <input
                id="notes"
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Preferred delivery window or gift note"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#713BDB]/20 bg-[#F8F6FF] text-[#24213A] focus:bg-white focus:outline-none focus:border-[#713BDB]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#713BDB]/10 space-y-3">
            <h2 className="font-display text-base font-bold text-[#24213A]">Payment Method</h2>
            <div className="p-4 rounded-xl border border-[#713BDB] bg-[#F8F6FF] flex items-start gap-3">
              <Truck className="w-5 h-5 text-[#713BDB] mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[#24213A]">Cash on Delivery (COD)</p>
                  <span className="text-xs font-bold text-[#713BDB]">Selected</span>
                </div>
                <p className="text-xs text-[#5C577A] mt-1">
                  Pay in cash when your parcel arrives at your doorstep. After clicking Place
                  Order, you will send your order details directly to our WhatsApp account for
                  immediate dispatch confirmation.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-[#713BDB] text-white text-sm font-semibold rounded-xl hover:bg-[#5E2EC4] transition-colors flex items-center justify-center gap-2.5 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Place Order & Prepare WhatsApp Details</span>
          </button>
        </form>

        <aside className="lg:col-span-5 rounded-2xl border border-[#713BDB]/15 bg-white p-6 shadow-xs space-y-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#24213A]">Order Summary</h2>
            <span className="text-xs text-[#5C577A] tabular-nums">
              {cartTotals.itemCount} {cartTotals.itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          <ul className="divide-y divide-[#713BDB]/10 max-h-[340px] overflow-y-auto pr-1">
            {cart.map((item) => (
              <li key={item.key} className="py-3.5 first:pt-0 flex items-center gap-3.5">
                <div className="w-16 h-12 rounded-xl overflow-hidden bg-[#F1EEFC] border border-[#713BDB]/10 shrink-0">
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    title={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#24213A] truncate">{item.name}</p>
                  <p className="text-xs text-[#5C577A]">
                    Qty {item.quantity}
                    {item.selectedColor ? ` · ${item.selectedColor}` : ''}
                    {item.selectedSize ? ` · ${item.selectedSize}` : ''}
                  </p>
                </div>
                <span className="text-sm font-bold text-[#24213A] tabular-nums shrink-0">
                  {formatPkr(item.pricePkr * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-2.5 text-sm border-t border-[#713BDB]/10 pt-4">
            <div className="flex items-center justify-between text-[#5C577A]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#24213A] tabular-nums">
                {formatPkr(cartTotals.subtotalPkr)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#5C577A]">
              <span>Delivery Fee (COD)</span>
              <span className="font-semibold text-[#24213A] tabular-nums">
                {cartTotals.shippingPkr === 0 ? 'Free' : formatPkr(cartTotals.shippingPkr)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#713BDB]/10 text-base font-bold text-[#24213A]">
              <span>Total Payable (PKR)</span>
              <span className="tabular-nums text-[#713BDB]">{formatPkr(cartTotals.totalPkr)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
