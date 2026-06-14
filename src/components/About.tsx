import { Award, Hammer, Heart, Leaf, Users, MapPin } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function About() {
  const { settings } = useSettings();

  if (!settings) return null;

  const features = [
    { icon: Hammer, title: 'Master Craftsmanship', description: 'Every joint, curve, and finish is done by hand by skilled artisans with decades of experience.' },
    { icon: Leaf,   title: 'Sustainable Wood',     description: 'We use premium, responsibly sourced Sheesham, Teak, and Mango wood for lasting quality.' },
    { icon: Heart,  title: 'Made with Passion',    description: 'Each creation carries the dedication of a craftsman who takes pride in every detail.' },
    { icon: Award,  title: 'Quality Guaranteed',   description: 'MSME certified. Every piece inspected before dispatch. Your satisfaction is our promise.' },
  ];

  const credentials = [
    { icon: Award,  label: 'MSME / Udyam Registered' },
    { icon: MapPin, label: 'Made in Maharashtra' },
    { icon: Users,  label: '1000+ Happy Customers' },
    { icon: Hammer, label: '25+ Years of Craft' },
  ];

  return (
    <section id="about" className="py-20 bg-royal-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="font-body text-royal-saffron font-semibold text-sm uppercase tracking-widest mb-3">
            Our Story
          </p>
          <h2 className="section-heading font-display text-4xl font-bold text-royal-mahogany mb-6">
            Crafting Excellence Since Generations
          </h2>
          <hr className="royal-divider w-24 mt-10 mb-4" />
          <p className="font-body text-royal-navy/70 max-w-2xl mx-auto">
            Durva Woodcraft was born from a love of wood and the art of shaping it. Based in Maharashtra, we combine traditional Indian carpentry with modern design sensibility to create furniture that lasts a lifetime.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((f, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-2xl bg-royal-surface border border-royal-border hover:shadow-royal-md transition-shadow"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center bg-royal-mahogany text-royal-bg">
                <f.icon size={26} />
              </div>
              <h3 className="font-display text-base font-bold text-royal-mahogany mb-2">{f.title}</h3>
              <p className="font-body text-sm text-royal-navy/70 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Government / Credibility strip */}
        <div className="bg-royal-navy rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl font-bold text-royal-bg mb-2">
              Government Recognized & Certified
            </h3>
            <p className="font-body text-royal-bg/70 text-sm">
              Durva Woodcraft is a registered MSME under the Government of India — eligible for bulk, institutional, and government procurement orders.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {credentials.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 border border-white/20 text-center"
              >
                <Icon size={22} className="text-royal-gold" />
                <span className="font-body text-sm text-royal-bg font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
