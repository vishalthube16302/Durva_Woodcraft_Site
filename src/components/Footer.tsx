import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function Footer() {
  const { settings } = useSettings();

  if (!settings) return null;

  const waNumber = settings.phone_numbers?.[0]?.replace(/\D/g, '') || '';

  const quickLinks = [
    { label: 'Home',         id: 'home' },
    { label: 'Products',     id: 'products' },
    { label: 'Custom Order', id: 'custom-order' },
    { label: 'About Us',     id: 'about' },
    { label: 'Contact',      id: 'contact' },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-royal-mahogany text-royal-bg">

      {/* Top CTA banner */}
      <div className="bg-royal-saffron py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg font-bold text-royal-bg">Ready to furnish your space?</p>
            <p className="font-body text-royal-bg/80 text-sm">Talk to us — custom orders welcome across India.</p>
          </div>
          <a
            href={`https://wa.me/${waNumber}?text=Hello%20Durva%20Woodcraft%2C%20I%27m%20interested%20in%20furniture!`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-royal-bg text-royal-mahogany font-semibold font-body text-sm whitespace-nowrap hover:bg-royal-cream transition-colors"
          >
            Get a Free Quote <ArrowRight size={14} />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold text-royal-bg mb-2">{settings.brand_name}</h3>
            <p className="font-body text-royal-bg/60 text-sm mb-5 leading-relaxed">{settings.tagline}</p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="badge-msme">MSME Registered</span>
              <span className="badge-handmade">🇮🇳 Make in India</span>
            </div>

            {/* Social — update hrefs when profiles are ready */}
            <div className="flex gap-3">
              {[
                { icon: Facebook,  href: 'https://facebook.com' },
                { icon: Instagram, href: 'https://instagram.com' },
                { icon: Youtube,   href: 'https://youtube.com' },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-royal-bg/10 hover:bg-royal-saffron transition-colors border border-royal-bg/20"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base font-bold text-royal-bg mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(({ label, id }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="font-body text-sm text-royal-bg/60 hover:text-royal-gold transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight size={12} />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-base font-bold text-royal-bg mb-5">Contact Us</h4>
            <div className="space-y-3 font-body text-sm text-royal-bg/60">
              <div className="flex gap-2 items-start">
                <MapPin size={14} className="text-royal-gold mt-0.5 flex-shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Phone size={14} className="text-royal-gold flex-shrink-0" />
                <span>{settings.phone_numbers[0]}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Mail size={14} className="text-royal-gold flex-shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          {/* Hours + Payment */}
          <div>
            <h4 className="font-display text-base font-bold text-royal-bg mb-5">Business Hours</h4>
            <div className="font-body text-sm text-royal-bg/60 space-y-1 mb-6">
              <p>Mon – Sat: 9:00 AM – 6:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
            <h4 className="font-display text-sm font-bold text-royal-bg mb-3">We Accept</h4>
            <div className="flex flex-wrap gap-2">
              {['UPI', 'PhonePe', 'GPay', 'COD'].map(m => (
                <span key={m} className="text-xs font-body px-2.5 py-1 rounded bg-royal-bg/10 text-royal-bg/80 border border-royal-bg/20">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-royal-bg/15 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-body text-royal-bg/40">
          <p>© {new Date().getFullYear()} {settings.brand_name}. All rights reserved.</p>
          <p>Handcrafted in Maharashtra 🪵 | Pan-India Delivery</p>
        </div>
      </div>
    </footer>
  );
}
