import { ArrowRight } from 'lucide-react';
import { ProductImage } from '../components/ProductImage';
import { STORE_CONFIG } from '../config/storeConfig';
import { useStore } from '../context/StoreContext';
import { HERO_MEDIA } from '../data/products';

const PILLARS = [
  {
    index: '01.',
    title: 'Material Honesty',
    accent: 'text-[#713BDB]',
    description:
      'Every piece begins with durable raw inputs: full-grain vegetable-tanned hides from Sialkot, combed long-staple cotton, 316L brushed steel, and fine IFRA-certified fragrance oils.',
  },
  {
    index: '02.',
    title: 'Quiet Everyday Utility',
    accent: 'text-[#FF626E]',
    description:
      'We avoid loud logos and fleeting trends. Our silhouettes are designed to pair cleanly across studio workdays, evening gatherings, and travel.',
  },
  {
    index: '03.',
    title: 'Transparent Nationwide Service',
    accent: 'text-[#0E7490]',
    description:
      'All prices are listed cleanly in Pakistani Rupees with straightforward Cash on Delivery and responsive direct support on WhatsApp.',
  },
];

export function AboutPage() {
  const { navigate } = useStore();

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      <section className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.12em] text-[#713BDB] font-bold">
          About {STORE_CONFIG.brandName}
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#24213A] mt-2 leading-[1.12]">
          Crafted for Modern Everyday Living in Pakistan
        </h1>
        <p className="mt-5 text-base text-[#5C577A] leading-relaxed">
          {STORE_CONFIG.brandName} was founded with a simple conviction: everyday essentials—your
          watch, leather wallet, overshirt, and signature scent—should carry the calm precision of
          international design houses without inflated luxury markups.
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[380px] rounded-2xl overflow-hidden bg-white border border-[#713BDB]/10 shadow-xs">
          <ProductImage
            src={HERO_MEDIA.atelierImage}
            alt="ShopZayn design studio and craft workshop"
            title="ShopZayn Studio"
            className="w-full h-full object-cover lg:absolute lg:inset-0"
          />
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#24213A]">
            Our Brand Story
          </h2>
          <p className="text-sm sm:text-[15px] text-[#5C577A] leading-relaxed">
            Operating between Lahore, Karachi, and Islamabad, we collaborate with specialist
            workshops that have produced leather goods and textiles for global labels for decades.
            By curating focused seasonal releases in small batches, we inspect every stitch, clasp,
            and bottle before it leaves our studio.
          </p>
          <p className="text-sm sm:text-[15px] text-[#5C577A] leading-relaxed">
            Whether you are ordering a chronograph for daily wear or gifting a hand-burnished folio,
            our Cash on Delivery experience and direct WhatsApp care ensure peace of mind from
            browsing to unboxing.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('shop')}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#713BDB] text-white text-sm font-semibold rounded-xl hover:bg-[#5E2EC4] transition-colors"
            >
              <span>Explore the Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="pt-12 border-t border-[#713BDB]/15">
        <div className="max-w-xl mb-10">
          <p className="text-xs uppercase tracking-[0.12em] text-[#713BDB] font-bold">
            Our Mission
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#24213A] mt-1">
            Fewer Pieces, Better Made
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="p-6 rounded-2xl border border-[#713BDB]/10 bg-white shadow-xs space-y-3"
            >
              <span className={`text-xs font-mono font-bold ${pillar.accent}`}>{pillar.index}</span>
              <h3 className="font-display text-lg font-bold text-[#24213A]">{pillar.title}</h3>
              <p className="text-sm text-[#5C577A] leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
