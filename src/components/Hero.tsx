import { ArrowRight } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function Hero() {
  const { settings } = useSettings();

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  if (!settings) return null;

  return (
    <section id="home" className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 opacity-60"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight mb-4" style={{ color: settings.primary_color }}>
                Crafting Timeless Wooden Masterpieces
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Each piece tells a story of craftsmanship, tradition, and dedication to excellence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToProducts}
                className="px-8 py-4 rounded-full text-white font-medium flex items-center justify-center gap-2 transition-all hover:shadow-xl"
                style={{ backgroundColor: settings.primary_color }}
              >
                Explore Collection
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-full border-2 font-medium transition-all"
                style={{ borderColor: settings.primary_color, color: settings.primary_color }}
              >
                Get in Touch
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <p className="text-4xl font-bold" style={{ color: settings.primary_color }}>25+</p>
                <p className="text-gray-600 text-sm mt-1">Years Experience</p>
              </div>
              <div>
                <p className="text-4xl font-bold" style={{ color: settings.primary_color }}>1000+</p>
                <p className="text-gray-600 text-sm mt-1">Happy Customers</p>
              </div>
              <div>
                <p className="text-4xl font-bold" style={{ color: settings.primary_color }}>100%</p>
                <p className="text-gray-600 text-sm mt-1">Handcrafted</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Premium wooden furniture"
                className="w-full h-[600px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
