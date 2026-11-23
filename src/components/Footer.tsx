import { Lock, MessageCircle } from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppUrl } from '../services/orderService';

export function Footer() {
  const { navigate } = useStore();
  const whatsappSupportUrl = buildWhatsAppUrl(
    `Hello ${STORE_CONFIG.brandName}, I have a question about your products.`
  );

  return (
    <footer className="bg-[#24213A] text-white mt-20">
      <div className="h-1 w-full bg-gradient-to-r from-[#713BDB] via-[#FF626E] to-[#FFC83D]" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="font-display text-2xl font-bold tracking-tight bg-gradient-to-r from-[#FFC83D] via-[#FF626E] to-[#28C5D7] bg-clip-text text-transparent"
            >
              {STORE_CONFIG.brandName}
            </button>
            <p className="text-sm text-white/75 leading-relaxed max-w-xs">
              Modern everyday objects, timepieces, leather goods, and tailored wardrobe
              staples—crafted for enduring utility across Pakistan.
            </p>
            <p className="text-xs text-white/55">{STORE_CONFIG.studioLocations}</p>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.08em] font-semibold text-[#FFC83D] mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'All', collection: 'all' })}
                  className="hover:text-white transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    navigate('shop', { category: 'Watches & Eyewear', collection: 'all' })
                  }
                  className="hover:text-white transition-colors"
                >
                  Watches & Eyewear
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'Leather Goods', collection: 'all' })}
                  className="hover:text-white transition-colors"
                >
                  Leather Goods
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'Apparel', collection: 'all' })}
                  className="hover:text-white transition-colors"
                >
                  Apparel & Wraps
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'Fragrances', collection: 'all' })}
                  className="hover:text-white transition-colors"
                >
                  Fragrances
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Care */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.08em] font-semibold text-[#28C5D7] mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm text-white/75">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About ShopZayn
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'All', collection: 'onSale' })}
                  className="hover:text-white transition-colors"
                >
                  Special Offers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('wishlist')}
                  className="hover:text-white transition-colors"
                >
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('cart')}
                  className="hover:text-white transition-colors"
                >
                  Shopping Cart
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Desk */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.08em] font-semibold text-[#FF626E]">
              Customer Desk
            </h3>
            <div className="text-sm text-white/75 space-y-1.5">
              <p>Cash on Delivery Nationwide</p>
              <p>{STORE_CONFIG.dispatchHours}</p>
              <p className="text-white/55">{STORE_CONFIG.supportEmail}</p>
            </div>
            <a
              href={whatsappSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#FFC83D] text-[#24213A] rounded-xl hover:bg-[#FFD363] transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order Help on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/55">
          <p>
            © {new Date().getFullYear()} {STORE_CONFIG.brandName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <p>Prices in Pakistani Rupees (PKR) · 7-Day Easy Exchange</p>
            <button
              type="button"
              onClick={() => navigate('admin-login')}
              aria-label="Admin Portal Login"
              className="inline-flex items-center gap-1 text-[11px] text-white/30 hover:text-white/65 transition-colors focus-visible:outline-2 focus-visible:outline-[#713BDB] rounded-xs"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
