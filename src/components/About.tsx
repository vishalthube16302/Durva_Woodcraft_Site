import { Award, Hammer, Heart, Leaf, Users, MapPin, Shield, Star, TrendingUp } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function About() {
  const { settings } = useSettings();
  if (!settings) return null;

  const waNumber = (settings.whatsapp_number || settings.phone_numbers?.[0] || '').replace(/\D/g, '');

  const features = [
    { icon: Hammer, title: 'Master Craftsmanship',
      description: 'Every joint, curve, and finish is done by hand by skilled artisans with decades of experience.' },
    { icon: Leaf, title: 'Sustainable Wood',
      description: 'We use premium, responsibly sourced Sheesham, Teak, and Mango wood for lasting quality.' },
    { icon: Heart, title: 'Made with Soul',
      description: "Each piece carries the warmth of human hands — no machine can replicate the character of true handcraft." },
    { icon: Users, title: 'Family Legacy',
      description: "Rooted in Maharashtra's rich woodworking tradition, we bring generations of craft knowledge to every order." },
  ];

  // Credentials — built from DB values, show only what's filled
  const credentials = [
    settings.msme_number && {
      icon: Award,
      label: 'MSME / Udyam Registered',
      value: settings.msme_number,
      sub: 'Udyam Certificate Holder'
    },
    settings.gst_number && {
      icon: Shield,
      label: 'GST Registered',
      value: settings.gst_number,
      sub: 'Pan-India B2B & B2C Invoicing'
    },
    {
      icon: Star,
      label: 'PM Vishwakarma Certified',
      value: null,
      sub: 'Ministry of MSME, Govt of India'
    },
    settings.gem_seller_id && {
      icon: TrendingUp,
      label: 'GeM Portal Listed',
      value: settings.gem_seller_id,
      sub: 'Government e-Marketplace'
    },
    !settings.gem_seller_id && {
      icon: TrendingUp,
      label: 'IndiaHandmade Listed',
      value: null,
      sub: 'Digital India Corporation Portal'
    },
  ].filter(Boolean) as { icon: any; label: string; value: string | null; sub: string }[];

  const woodTypes = [
    { name: 'Sheesham', hindi: 'शीशम',  desc: 'Most popular. Hard, durable, beautiful grain. Ideal for all furniture types.', color: '#7B3F00' },
    { name: 'Teak',     hindi: 'सागवान', desc: 'Premium grade. Water-resistant. Long-lasting. Best for outdoor + luxury interiors.', color: '#8B6914' },
    { name: 'Mango',    hindi: 'आंबा',   desc: 'Eco-friendly. Unique grain. Affordable yet premium. Great for decor.', color: '#5C3317' },
    { name: 'Sal',      hindi: 'साल',    desc: 'Strong and heavy. Traditional Indian wood. Excellent for structural furniture.', color: '#4A2810' },
  ];

  return (
    <section id="about" className="py-20 bg-royal-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-body text-royal-brown font-semibold text-xs uppercase tracking-widest mb-3">Our Story</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-royal-mahogany mb-4">
            Honoring Maharashtra's<br />Woodcraft Heritage
          </h2>
          <hr className="royal-divider w-20 mx-auto mt-2" />
        </div>

        {/* Story + features */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <p className="font-body text-royal-navy/70 leading-relaxed mb-5 text-base">
              Durva Woodcraft was born from a passion for preserving Maharashtra's rich tradition of woodworking.
              Based in Nashik, we create handcrafted wooden furniture that blends timeless craft with the demands
              of modern living — custom-built to your exact specifications, delivered across India.
            </p>
            <p className="font-body text-royal-navy/70 leading-relaxed mb-6 text-base">
              Every piece we create is a testament to the skill passed down through generations — from raw timber
              selection to final polish, nothing leaves our workshop until it meets our standard of excellence.
              No mass production. No shortcuts.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { num: '25+',  label: 'Years of Craft' },
                { num: '500+', label: 'Happy Families' },
                { num: '100%', label: 'Handmade' },
              ].map(({ num, label }) => (
                <div key={label} className="text-center p-4 bg-royal-bg rounded-xl border border-royal-border">
                  <p className="font-display text-2xl font-bold text-royal-brown">{num}</p>
                  <p className="font-body text-xs text-royal-navy/60 mt-1">{label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm font-body text-royal-navy/60">
              <MapPin size={15} className="text-royal-gold flex-shrink-0" />
              <span>Workshop in <strong className="text-royal-mahogany">Nashik, Maharashtra</strong> · Delivering Pan-India</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-royal-bg rounded-2xl p-5 border border-royal-border shadow-royal-sm hover:shadow-royal-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-royal-surface flex items-center justify-center mb-3">
                  <Icon size={20} className="text-royal-brown" />
                </div>
                <h3 className="font-display text-sm font-bold text-royal-mahogany mb-1">{title}</h3>
                <p className="font-body text-xs text-royal-navy/60 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Government Credentials — DB driven */}
        <div className="bg-royal-navy rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <p className="font-body text-royal-gold font-semibold text-xs uppercase tracking-widest mb-2">
              Official Recognition
            </p>
            <h3 className="font-display text-2xl font-bold text-royal-bg">
              Government Certified & Registered
            </h3>
            <p className="font-body text-royal-bg/60 text-sm mt-2 max-w-lg mx-auto">
              Durva Woodcraft is formally registered with the Government of India — eligible for government
              tenders, bulk orders, and institutional supply.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {credentials.map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="bg-royal-bg/8 border border-royal-bg/15 rounded-xl p-5 text-center hover:bg-royal-bg/12 transition-colors">
                <div className="w-10 h-10 rounded-full bg-royal-gold/20 flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} className="text-royal-gold" />
                </div>
                <p className="font-body text-sm font-semibold text-royal-bg">{label}</p>
                {value && (
                  <p className="font-body text-xs text-royal-gold font-bold mt-1 tracking-wide">{value}</p>
                )}
                <p className="font-body text-xs text-royal-bg/50 mt-1">{sub}</p>
              </div>
            ))}
          </div>

          {/* Bulk order CTA */}
          <div className="mt-8 pt-6 border-t border-royal-bg/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-display text-base font-bold text-royal-bg">Government & Bulk Orders Welcome</p>
              <p className="font-body text-sm text-royal-bg/60">
                GST invoicing · MSME rates · Institutional supply capability
                {settings.msme_number && ` · MSME: ${settings.msme_number}`}
              </p>
            </div>
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}?text=Hello%20Durva%20Woodcraft%2C%20I%27m%20interested%20in%20a%20bulk%2Fgovernment%20order.`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-royal-gold text-royal-mahogany font-semibold font-body text-sm whitespace-nowrap hover:bg-amber-400 transition-colors"
              >
                Enquire for Bulk Order →
              </a>
            )}
          </div>
        </div>

        {/* Wood types */}
        <div>
          <div className="text-center mb-8">
            <p className="font-body text-royal-brown font-semibold text-xs uppercase tracking-widest mb-2">Our Materials</p>
            <h3 className="font-display text-2xl font-bold text-royal-mahogany">Premium Wood We Work With</h3>
            <hr className="royal-divider w-16 mx-auto mt-4" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {woodTypes.map(({ name, hindi, desc, color }) => (
              <div key={name} className="rounded-2xl overflow-hidden border border-royal-border shadow-royal-sm hover:shadow-royal-md transition-all hover:-translate-y-0.5">
                <div className="h-20 w-full" style={{ backgroundColor: color }} />
                <div className="p-4 bg-royal-bg">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h4 className="font-display text-base font-bold text-royal-mahogany">{name}</h4>
                    <span className="font-body text-xs text-royal-navy/40">{hindi}</span>
                  </div>
                  <p className="font-body text-xs text-royal-navy/60 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
