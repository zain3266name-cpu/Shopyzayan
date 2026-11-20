import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import { STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppUrl } from '../services/orderService';
import { storageService } from '../services/storageService';

export function ContactPage() {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const whatsappDirectUrl = buildWhatsAppUrl(
    `Hello ${STORE_CONFIG.brandName} Support, I would like to inquire about an order or product.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      showToast('Missing details', 'Please enter your name and message.', 'error');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showToast('Invalid email', 'Please enter a valid email address.', 'error');
      return;
    }

    storageService.saveContactInquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    showToast('Inquiry saved', 'For the fastest reply, you can also message us on WhatsApp.');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="max-w-2xl pb-10 border-b border-[#713BDB]/15">
        <p className="text-xs uppercase tracking-[0.12em] text-[#713BDB] font-bold">
          Customer Care
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#24213A] mt-2">
          Get in Touch
        </h1>
        <p className="mt-3 text-base text-[#5C577A] leading-relaxed">
          Questions about sizing, Cash on Delivery timelines, or bulk corporate gifting? Reach our
          desk directly via WhatsApp or send us a note below.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-emerald-200 bg-[#F4FBF7] space-y-4">
            <div className="space-y-1">
              <h2 className="font-display text-lg font-bold text-[#24213A]">WhatsApp Order Desk</h2>
              <p className="text-sm text-[#5C577A]">
                Fastest response for product questions, sizing advice, and parcel tracking.
              </p>
            </div>
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-5 py-3 bg-[#166534] text-white text-sm font-semibold rounded-xl hover:bg-[#14532D] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          <div className="rounded-2xl border border-[#713BDB]/10 bg-white shadow-xs divide-y divide-[#713BDB]/10">
            <div className="p-5 flex items-start gap-3.5">
              <Phone className="w-4 h-4 text-[#713BDB] mt-1 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-[#6B6589] font-semibold">
                  Phone / WhatsApp
                </p>
                <p className="text-sm font-semibold text-[#24213A] mt-0.5 font-mono">
                  {STORE_CONFIG.whatsappDisplay}
                </p>
              </div>
            </div>

            <div className="p-5 flex items-start gap-3.5">
              <Mail className="w-4 h-4 text-[#FF626E] mt-1 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-[#6B6589] font-semibold">
                  Email
                </p>
                <p className="text-sm font-semibold text-[#24213A] mt-0.5">
                  {STORE_CONFIG.supportEmail}
                </p>
              </div>
            </div>

            <div className="p-5 flex items-start gap-3.5">
              <Clock className="w-4 h-4 text-[#0E7490] mt-1 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-[#6B6589] font-semibold">
                  Support Hours
                </p>
                <p className="text-sm font-semibold text-[#24213A] mt-0.5">
                  {STORE_CONFIG.dispatchHours}
                </p>
              </div>
            </div>

            <div className="p-5 flex items-start gap-3.5">
              <MapPin className="w-4 h-4 text-[#9A6B2F] mt-1 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-[#6B6589] font-semibold">
                  Dispatch Hubs
                </p>
                <p className="text-sm font-semibold text-[#24213A] mt-0.5">
                  {STORE_CONFIG.studioLocations}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-2xl border border-[#713BDB]/15 bg-white p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
              <h2 className="font-display text-2xl font-bold text-[#24213A]">Message Received</h2>
              <p className="text-sm text-[#5C577A] max-w-md mx-auto">
                Thank you for reaching out to {STORE_CONFIG.brandName}. Our team responds within
                one business day—or reach us immediately via WhatsApp.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2.5 bg-[#F8F6FF] border border-[#713BDB]/20 text-sm font-semibold text-[#24213A] rounded-xl hover:border-[#713BDB]"
                >
                  Send Another Note
                </button>
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#166534] text-white text-sm font-semibold rounded-xl hover:bg-[#14532D]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="font-display text-xl font-bold text-[#24213A]">Send a Message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-[#24213A] mb-1.5">
                    Your Name <span className="text-[#FF626E]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ayesha Khan"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F6FF] border border-[#713BDB]/20 rounded-xl text-[#24213A] focus:bg-white focus:outline-none focus:border-[#713BDB]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-semibold text-[#24213A] mb-1.5">
                    Phone / WhatsApp
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F6FF] border border-[#713BDB]/20 rounded-xl text-[#24213A] focus:bg-white focus:outline-none focus:border-[#713BDB]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-[#24213A] mb-1.5">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F8F6FF] border border-[#713BDB]/20 rounded-xl text-[#24213A] focus:bg-white focus:outline-none focus:border-[#713BDB]"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-[#24213A] mb-1.5">
                  Message <span className="text-[#FF626E]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F8F6FF] border border-[#713BDB]/20 rounded-xl text-[#24213A] focus:bg-white focus:outline-none focus:border-[#713BDB]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#713BDB] text-white text-sm font-semibold rounded-xl hover:bg-[#5E2EC4] transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
