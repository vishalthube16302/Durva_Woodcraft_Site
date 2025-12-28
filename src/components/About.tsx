import { Award, Hammer, Heart, Leaf } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function About() {
  const { settings } = useSettings();

  if (!settings) return null;

  const features = [
    {
      icon: Hammer,
      title: 'Master Craftsmanship',
      description: 'Meticulously handcrafted by skilled artisans'
    },
    {
      icon: Leaf,
      title: 'Sustainable Wood',
      description: 'Premium, sustainably sourced wood materials'
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Each creation carries passion and dedication'
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: 'Commitment to excellence in every piece'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: settings.primary_color }}>
            Crafting Excellence Since Generations
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-lg transition-shadow"
            >
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: settings.primary_color }}
              >
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: settings.primary_color }}>
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
