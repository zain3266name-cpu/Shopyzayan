import { STORE_CONFIG, formatPkr } from '../config/storeConfig';
import { CartItem, CheckoutFormData, OrderRecord } from '../types/store';
import { storageService } from './storageService';

export function calculateCartTotals(items: CartItem[]) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPkr = items.reduce((sum, item) => sum + item.pricePkr * item.quantity, 0);
  const shippingPkr =
    subtotalPkr === 0 || subtotalPkr >= STORE_CONFIG.freeShippingThresholdPkr
      ? 0
      : STORE_CONFIG.standardShippingFeePkr;
  const totalPkr = subtotalPkr + shippingPkr;

  return {
    itemCount,
    subtotalPkr,
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
  totalPkr: number
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
  prepareWhatsAppOrder(customer: CheckoutFormData, items: CartItem[]): OrderRecord {
    const { subtotalPkr, shippingPkr, totalPkr } = calculateCartTotals(items);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SZ-${new Date().getFullYear()}-${randomSuffix}`;
    const whatsappMessage = buildWhatsAppOrderMessage(
      orderNumber,
      customer,
      items,
      subtotalPkr,
      shippingPkr,
      totalPkr
    );
    const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

    const record: OrderRecord = {
      orderNumber,
      createdAtIso: new Date().toISOString(),
      customer,
      items,
      subtotalPkr,
      shippingPkr,
      totalPkr,
      whatsappMessage,
      whatsappUrl,
    };

    storageService.saveLastOrder(record);
    return record;
  },
};
