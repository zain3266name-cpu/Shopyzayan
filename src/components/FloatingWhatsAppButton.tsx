import { MessageCircle } from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';
import { buildWhatsAppUrl } from '../services/orderService';

export function FloatingWhatsAppButton() {
  const supportUrl = buildWhatsAppUrl(STORE_CONFIG.whatsappSupportMessage);

  return (
    <a
      href={supportUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with ShopZayn support on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 h-11 px-4 rounded-full bg-[#166534] text-white text-xs font-medium shadow-lg border border-black/10 hover:bg-[#14532D] hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534]"
    >
      <MessageCircle className="w-4 h-4 shrink-0" />
      <span className="hidden sm:inline whitespace-nowrap">WhatsApp Support</span>
    </a>
  );
}
