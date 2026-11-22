import {
  ArrowRight,
  Banknote,
  Briefcase,
  Check,
  MessageCircle,
  ShieldCheck,
  Shirt,
  Sparkles,
  Truck,
  Watch,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import { RecentlyViewedSection } from '../components/RecentlyViewedSection';
import { formatPkr, STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { HERO_MEDIA } from '../data/products';
import { catalogService } from '../services/catalogService';
import { storageService } from '../services/storageService';
import { ProductCategory } from '../types/store';

const FEATURED_CATEGORIES: Array<{
  title: string;
  subtitle: string;
  category: ProductCategory;
  image: string;
  icon: typeof Watch;
  accentBg: string;
  accentText: string;
}> = [
  {
    title: 'Watches & Eyewear',
    subtitle: 'Chronographs & Acetate Frames',
    category: 'Watches & Eyewear',
    image: '/src/assets/images/product_watch_chronograph_1795189488124.jpg',
    icon: Watch,
    accentBg: 'bg-[#713BDB]',
    accentText: 'text-white',
  },
  {
    title: 'Leather Goods',
    subtitle: 'Full-Grain Totes & Wallets',
    category: 'Leather Goods',
    image: '/src/assets/images/product_leather_tote_1795189487508.jpg',
    icon: Briefcase,
    accentBg: 'bg-[#FF626E]',
    accentText: 'text-white',
  },
  {
    title: 'Apparel',
    subtitle: 'Heavyweight Twill & Cashmere',
    category: 'Apparel',
    image: '/src/assets/images/product_linen_overshirt_1795189490490.jpg',
    icon: Shirt,
    accentBg: 'bg-[#28C5D7]',
    accentText: 'text-[#24213A]',
  },
  {
    title: 'Fragrances & Home',
    subtitle: 'Extrait de Parfum & Stoneware',
    category: 'Fragrances',
    image: '/src/assets/images/product_oud_fragrance_1795189488110.jpg',
    icon: Sparkles,
    accentBg: 'bg-[#FFC83D]',
    accentText: 'text-[#24213A]',
  },
];

export function HomePage() {
  const { navigate, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  const featuredProducts = useMemo(
    () => catalogService.queryProducts({ collection: 'trending' }).slice(0, 4),
    []
  );
  const bestSellers = useMemo(
    () => catalogService.queryProducts({ collection: 'bestSeller' }).slice(0, 4),
    []
  );
  const newArrivals = useMemo(
    () => catalogService.queryProducts({ collection: 'newArrival' }).slice(0, 4),
    []
  );
  const specialOffers = useMemo(
    () =>
      catalogService
        .queryProducts({
          collection: 'onSale',
          sortBy: 'discountDesc',
        })
        .slice(0, 4),
    []
  );

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Enter a valid email', 'Please check your email address and try again.', 'error');
      return;
    }
    const result = storageService.saveNewsletterEmail(email);
    setNewsletterDone(true);
    setNewsletterEmail('');
    showToast(
      result.alreadySubscribed ? 'Already subscribed' : 'Welcome to ShopZayn',
      result.alreadySubscribed
        ? 'You are already on our seasonal release list.'
        : 'You will receive early access to new drops and seasonal offers.'
    );
  };

  return (
    <div>
      {/* 1. Vibrant Purple-to-Coral Hero Banner */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#713BDB] via-[#AC479D] to-[#FF626E] text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch p-6 sm:p-10 lg:p-12">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.14em] text-[#FFC83D] font-bold mb-3">
                New Season Collection · Pakistan
              </p>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight text-white leading-[1.08]">
                Bold Essentials for Modern Living
              </h1>
              <p className="mt-4 text-sm sm:text-base text-white/90 leading-relaxed max-w-lg">
                Discover curated timepieces, full-grain leather carry, heavyweight apparel, and
                signature fragrances—delivered nationwide with effortless Cash on Delivery.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'All', collection: 'all' })}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FFC83D] text-[#24213A] text-sm font-bold rounded-xl hover:bg-[#FFD363] transition-colors shadow-md whitespace-nowrap"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('shop', { category: 'All', collection: 'onSale' })}
                  className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/15 border border-white/30 text-white text-sm font-semibold rounded-xl hover:bg-white/25 transition-colors whitespace-nowrap"
                >
                  <span>Special Offers</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-full min-h-[240px] sm:min-h-[340px] lg:min-h-[400px] rounded-2xl overflow-hidden bg-white/10 border border-white/20 shadow-lg">
                <ProductImage
                  src={HERO_MEDIA.bannerImage}
                  alt="ShopZayn tailored charcoal blazer, structured leather bag, and steel timepiece"
                  title="ShopZayn Featured Collection"
                  loading="eager"
                  className="w-full h-full object-cover lg:absolute lg:inset-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Trust Section */}
        <div
          aria-label="ShopZayn customer trust assurances"
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1C192E] border border-[#713BDB]/10 dark:border-white/10 shadow-xs transition-colors">
            <span className="w-10 h-10 rounded-xl bg-[#713BDB]/10 dark:bg-[#713BDB]/25 text-[#713BDB] dark:text-[#A78BFA] flex items-center justify-center shrink-0">
              <Banknote className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-[#24213A] dark:text-[#F4F2FF]">Cash on Delivery</p>
              <p className="text-xs text-[#5C577A] dark:text-[#B8B3D1] mt-0.5">
                Pay in cash at your doorstep across Pakistan
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1C192E] border border-[#713BDB]/10 dark:border-white/10 shadow-xs transition-colors">
            <span className="w-10 h-10 rounded-xl bg-[#28C5D7]/15 text-[#0E7490] dark:text-[#28C5D7] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-[#24213A] dark:text-[#F4F2FF]">
                Nationwide Delivery
              </p>
              <p className="text-xs text-[#5C577A] dark:text-[#B8B3D1] mt-0.5">
                Free shipping above {formatPkr(STORE_CONFIG.freeShippingThresholdPkr)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1C192E] border border-[#713BDB]/10 dark:border-white/10 shadow-xs transition-colors">
            <span className="w-10 h-10 rounded-xl bg-[#FFC83D]/25 text-[#854D0E] dark:text-[#FFC83D] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-[#24213A] dark:text-[#F4F2FF]">
                Secure Order Experience
              </p>
              <p className="text-xs text-[#5C577A] dark:text-[#B8B3D1] mt-0.5">
                Verified PKR receipts & 7-day easy exchange
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1C192E] border border-[#713BDB]/10 dark:border-white/10 shadow-xs transition-colors">
            <span className="w-10 h-10 rounded-xl bg-[#FF626E]/15 text-[#BE123C] dark:text-[#FF626E] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-[#24213A] dark:text-[#F4F2FF]">Customer Support</p>
              <p className="text-xs text-[#5C577A] dark:text-[#B8B3D1] mt-0.5">
                Direct WhatsApp help · {STORE_CONFIG.dispatchHours}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Colorful Category Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[#713BDB] dark:text-[#A78BFA] font-bold">
              Shop by Department
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#24213A] dark:text-[#F4F2FF] mt-1">
              Explore Categories
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('shop', { category: 'All', collection: 'all' })}
            className="text-sm font-semibold text-[#713BDB] dark:text-[#A78BFA] hover:underline underline-offset-4 whitespace-nowrap"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FEATURED_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.title}
                type="button"
                onClick={() => navigate('shop', { category: cat.category, collection: 'all' })}
                className="group text-left bg-white dark:bg-[#1C192E] rounded-2xl border border-[#713BDB]/10 dark:border-white/10 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden focus-visible:outline-2 focus-visible:outline-[#713BDB]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F1EEFC] dark:bg-[#26223D]">
                  <ProductImage
                    src={cat.image}
                    alt={cat.title}
                    title={cat.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                  <span
                    className={`absolute bottom-2.5 left-2.5 w-9 h-9 rounded-xl ${cat.accentBg} ${cat.accentText} flex items-center justify-center shadow-sm`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                </div>
                <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-[#24213A] dark:text-[#F4F2FF] group-hover:text-[#713BDB] dark:group-hover:text-[#A78BFA] transition-colors truncate">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#5C577A] dark:text-[#B8B3D1] mt-0.5 truncate">
                      {cat.subtitle}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#713BDB] dark:text-[#A78BFA] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Product Section: Featured Products */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-[#713BDB]/10 dark:border-white/10">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[#713BDB] dark:text-[#A78BFA] font-bold">
              Curated Edit
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#24213A] dark:text-[#F4F2FF] mt-1">
              Featured Products
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('shop', { category: 'All', collection: 'trending' })}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#713BDB] dark:text-[#A78BFA] hover:underline underline-offset-4 whitespace-nowrap"
          >
            <span>See All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Product Section: Special Offers */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl bg-gradient-to-br from-[#FFF1F3] via-[#FBF7FF] to-[#FFF9E8] dark:from-[#261926] dark:via-[#1C192E] dark:to-[#241E2B] border border-[#FF626E]/20 dark:border-[#FF626E]/25 p-5 sm:p-8 lg:p-10 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#FF626E] font-bold">
                Limited Seasonal Markdowns
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#24213A] dark:text-[#F4F2FF] mt-1">
                Special Offers
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('shop', { category: 'All', collection: 'onSale' })}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF626E] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#E84D5A] transition-colors self-start sm:self-auto whitespace-nowrap"
            >
              <span>All Deals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {specialOffers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Product Section: Best Sellers */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[#9A6B2F] dark:text-[#FFC83D] font-bold">
              Customer Favorites
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#24213A] dark:text-[#F4F2FF] mt-1">
              Best Sellers
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('shop', { category: 'All', collection: 'bestSeller' })}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#713BDB] dark:text-[#A78BFA] hover:underline underline-offset-4 whitespace-nowrap"
          >
            <span>See All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Product Section: New Arrivals */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-[#713BDB]/10 dark:border-white/10">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[#0E7490] dark:text-[#28C5D7] font-bold">
              Fresh Drops
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#24213A] dark:text-[#F4F2FF] mt-1">
              New Arrivals
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('shop', { category: 'All', collection: 'newArrival' })}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#713BDB] dark:text-[#A78BFA] hover:underline underline-offset-4 whitespace-nowrap"
          >
            <span>See All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. Editorial Craft Banner */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="rounded-3xl overflow-hidden border border-[#713BDB]/15 dark:border-white/10 bg-white dark:bg-[#1C192E] shadow-sm grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 relative min-h-[240px] sm:min-h-[340px]">
            <ProductImage
              src={HERO_MEDIA.atelierImage}
              alt="ShopZayn design workshop with raw cotton textiles and leather hardware"
              title="ShopZayn Atelier"
              className="w-full h-full object-cover lg:absolute lg:inset-0"
            />
          </div>
          <div className="lg:col-span-5 p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.12em] text-[#713BDB] dark:text-[#A78BFA] font-bold">
              Small-Batch Craftsmanship
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#24213A] dark:text-[#F4F2FF] mt-2 leading-snug">
              Built in Small Batches, Priced Transparently
            </h2>
            <p className="mt-3 text-sm text-[#5C577A] dark:text-[#B8B3D1] leading-relaxed">
              We partner directly with skilled Pakistani leather ateliers and international movement
              makers—bringing gallery-grade pieces directly to your doorstep without retail markups.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('shop', { category: 'All', collection: 'onSale' })}
                className="px-5 py-3 bg-[#713BDB] text-white text-sm font-semibold rounded-xl hover:bg-[#5E2EC4] transition-colors whitespace-nowrap"
              >
                Shop Offers
              </button>
              <button
                type="button"
                onClick={() => navigate('about')}
                className="px-5 py-3 bg-[#F8F6FF] dark:bg-[#26223D] border border-[#713BDB]/20 dark:border-white/15 text-[#24213A] dark:text-[#F4F2FF] text-sm font-semibold rounded-xl hover:border-[#713BDB] transition-colors whitespace-nowrap"
              >
                Our Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Recently Viewed */}
      <RecentlyViewedSection />

      {/* 10. Newsletter Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <div className="rounded-3xl bg-white dark:bg-[#1C192E] border border-[#713BDB]/15 dark:border-white/10 p-7 sm:p-10 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="font-display text-2xl font-bold text-[#24213A] dark:text-[#F4F2FF]">
              Join the ShopZayn Dispatch
            </h2>
            <p className="text-sm text-[#5C577A] dark:text-[#B8B3D1] mt-1.5">
              Receive notes on new batch arrivals, restocks, and exclusive seasonal markdowns.
            </p>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:min-w-[420px]"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={newsletterEmail}
              onChange={(e) => {
                setNewsletterEmail(e.target.value);
                if (newsletterDone) setNewsletterDone(false);
              }}
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 text-sm bg-[#F8F6FF] dark:bg-[#26223D] border border-[#713BDB]/20 dark:border-white/15 rounded-xl text-[#24213A] dark:text-[#F4F2FF] placeholder:text-[#8E89A8] focus:outline-none focus:bg-white dark:focus:bg-[#2E294A] focus:border-[#713BDB]"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#713BDB] text-white text-sm font-semibold rounded-xl hover:bg-[#5E2EC4] transition-colors whitespace-nowrap shrink-0"
            >
              {newsletterDone ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Subscribed</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
