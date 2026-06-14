import { ArrowRight, Shield, Truck, Award } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function Hero() {
  const { settings } = useSettings();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!settings) return null;

  return (
    <section id="home" className="relative pt-36 pb-20 overflow-hidden bg-royal-bg">

      {/* Subtle wood grain background */}
      <div className="absolute inset-0 bg-grain opacity-60 pointer-events-none" />

      {/* Top gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-royal-gold to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — Content */}
          <div className="space-y-8">

            {/* Top badges */}
            <div className="flex flex-wrap gap-2">
              <span className="badge-handmade">🇮🇳 Make in India</span>
              <span className="badge-msme">MSME Registered</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded bg-royal-gold/20 text-royal-mahogany border border-royal-gold/40">
                🪵 100% Handcrafted
              </span>
            </div>

            <div>
              <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight text-royal-mahogany mb-5">
                Honoring Nature,{' '}
                <span className="text-royal-brown">Crafting Life.</span>
              </h1>
              <p className="font-body text-lg text-royal-navy/70 leading-relaxed max-w-lg">
                Handmade wooden furniture crafted by skilled artisans in Maharashtra — delivered across India. Each piece carries the soul of genuine craftsmanship.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo('products')}
                className="royal-btn-primary flex items-center justify-center gap-2 text-base"
              >
                Explore Collection
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => scrollTo('custom-order')}
                className="royal-btn-outline text-base"
              >
                Custom Order
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-royal-border">
              {[
                { val: '25+', label: 'Years of Craft' },
                { val: '1000+', label: 'Happy Customers' },
                { val: '100%', label: 'Handmade' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-3xl font-bold text-royal-brown">{val}</p>
                  <p className="font-body text-sm text-royal-navy/70 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Truck,  text: 'Pan-India Delivery' },
                { icon: Shield, text: 'Quality Guarantee' },
                { icon: Award,  text: 'MSME Certified' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm font-body text-royal-navy/80">
                  <Icon size={15} className="text-royal-gold" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Hero image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-royal-lg border border-royal-border">
              <img
                src="https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Premium handcrafted wooden furniture by Durva Woodcraft"
                className="w-full h-[580px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-mahogany/20 to-transparent pointer-events-none" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-royal-bg border border-royal-border rounded-xl shadow-royal-md px-5 py-4">
              <p className="font-display text-royal-mahogany font-bold text-sm">Handcrafted in</p>
              <p className="font-body text-royal-brown font-semibold text-base">Maharashtra, India 🇮🇳</p>
            </div>

            {/* Gold corner accent */}
            <div className="absolute -top-2 -right-2 w-16 h-16 border-t-2 border-r-2 border-royal-gold rounded-tr-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
