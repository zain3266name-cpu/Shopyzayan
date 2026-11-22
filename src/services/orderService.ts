import { STORE_CONFIG, formatPkr } from '../config/storeConfig';
import { CartItem, CheckoutFormData, OrderRecord } from '../types/store';
import { storageService } from './storageService';

export function resolvePromoCode(code?: string) {
  const normalized = (code || '').trim().toUpperCase();
  if (!normalized) return null;
  if (normalized === 'ZAYN10') {
    return { code: 'ZAYN10', ...STORE_CONFIG.promoCodes.ZAYN10 };
  }
  if (normalized === 'FREESHIP') {
    return { code: 'FREESHIP', ...STORE_CONFIG.promoCodes.FREESHIP };
  }
  return null;
}

export function calculateCartTotals(items: CartItem[], promoCode?: string) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPkr = items.reduce((sum, item) => sum + item.pricePkr * item.quantity, 0);
  const promo = resolvePromoCode(promoCode);

  const discountPkr =
    promo && promo.type === 'percent' && subtotalPkr > 0
      ? Math.round((subtotalPkr * promo.value) / 100)
      : 0;

  const discountedSubtotal = Math.max(0, subtotalPkr - discountPkr);

  const shippingPkr =
    subtotalPkr === 0 ||
    discountedSubtotal >= STORE_CONFIG.freeShippingThresholdPkr ||
    promo?.type === 'freeShipping'
      ? 0
      : STORE_CONFIG.standardShippingFeePkr;

  const totalPkr = discountedSubtotal + shippingPkr;

  return {
    itemCount,
    subtotalPkr,
    discountPkr,
    appliedPromoCode: promo?.code ?? null,
    shippingPkr,
    totalPkr,
  };
}

export function buildWhatsAppOrderMessage(
  orderNumber: string,
  customer: CheckoutFormData,
  items: CartItem[],
  subtotalPkr: number,
  shippingPkr: number,
  totalPkr: number,
  discountPkr = 0,
  promoCode?: string | null
): string {
  const itemLines = items.map((item, idx) => {
    const variantParts = [
      item.selectedColor ? `Color: ${item.selectedColor}` : null,
      item.selectedSize ? `Size: ${item.selectedSize}` : null,
    ]
      .filter(Boolean)
      .join(', ');

    const variantLabel = variantParts ? ` (${variantParts})` : '';
    return `${idx + 1}. ${item.name}${variantLabel} × ${item.quantity} — ${formatPkr(
      item.pricePkr * item.quantity
    )}`;
  });

  const lines = [
    `*NEW ORDER — ${STORE_CONFIG.brandName}*`,
    `Order Ref: *${orderNumber}*`,
    `Payment Method: Cash on Delivery (COD)`,
    ``,
    `*Items Ordered:*`,
    ...itemLines,
    ``,
    `Subtotal: ${formatPkr(subtotalPkr)}`,
    discountPkr > 0 && promoCode ? `Promo (${promoCode}): -${formatPkr(discountPkr)}` : null,
    `Delivery: ${shippingPkr === 0 ? 'FREE' : formatPkr(shippingPkr)}`,
    `*Total Payable (COD): ${formatPkr(totalPkr)}*`,
    ``,
    `*Customer Details:*`,
    `Name: ${customer.fullName.trim()}`,
    `Phone: ${customer.phone.trim()}`,
    customer.email.trim() ? `Email: ${customer.email.trim()}` : null,
    `City: ${customer.city.trim()}`,
    `Address: ${customer.address.trim()}`,
    customer.notes.trim() ? `Notes: ${customer.notes.trim()}` : null,
  ].filter((line): line is string => line !== null);

  return lines.join('\n');
}

export function buildWhatsAppUrl(message: string): string {
  const cleanPhone = STORE_CONFIG.whatsappNumber.replace(/[^\d]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Prepares a validated client-side order record and WhatsApp dispatch URL.
 * Intentionally does NOT pretend to send to a backend server in Phase 1;
 * ready for Phase 2 server/Firebase order persistence.
 */
export const orderService = {
  prepareWhatsAppOrder(
    customer: CheckoutFormData,
    items: CartItem[],
    promoCode?: string
  ): OrderRecord {
    const { subtotalPkr, discountPkr, appliedPromoCode, shippingPkr, totalPkr } =
      calculateCartTotals(items, promoCode);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SZ-${new Date().getFullYear()}-${randomSuffix}`;
    const whatsappMessage = buildWhatsAppOrderMessage(
      orderNumber,
      customer,
      items,
      subtotalPkr,
      shippingPkr,
      totalPkr,
      discountPkr,
      appliedPromoCode
    );
    const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

    const record: OrderRecord = {
      orderNumber,
      createdAtIso: new Date().toISOString(),
      customer,
      items,
      subtotalPkr,
      discountPkr,
      promoCode: appliedPromoCode ?? undefined,
      shippingPkr,
      totalPkr,
      whatsappMessage,
      whatsappUrl,
    };

    storageService.saveLastOrder(record);
    return record;
  },
};
