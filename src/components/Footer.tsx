import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, ArrowRight, Award, Shield, ExternalLink } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function Footer() {
  const { settings } = useSettings();
  if (!settings) return null;

  const waNumber = (settings.whatsapp_number || settings.phone_numbers?.[0] || '').replace(/\D/g, '');

  const quickLinks = [
    { label: 'Home',         id: 'home' },
    { label: 'Products',     id: 'products' },
    { label: 'Custom Order', id: 'custom-order' },
    { label: 'About Us',     id: 'about' },
    { label: 'Bulk Orders',  id: 'corporate' },
    { label: 'Contact',      id: 'contact' },
  ];

  const govLinks = [
    { label: 'IndiaHandmade Portal',   href: 'https://indiahandmade.com' },
    { label: 'PM Vishwakarma Scheme',  href: 'https://pmvishwakarma.gov.in' },
    { label: 'GeM (Govt Orders)',      href: 'https://gem.gov.in' },
    { label: 'Udyam Registration',     href: 'https://udyamregistration.gov.in' },
  ];

  // Social icons from JSONB social_links — only render if URL is filled
  const socials = [
    { icon: Facebook,  href: settings.social_links?.facebook,  label: 'Facebook' },
    { icon: Instagram, href: settings.social_links?.instagram, label: 'Instagram' },
    { icon: Youtube,   href: settings.social_links?.youtube,   label: 'YouTube' },
  ].filter(s => s.href && s.href.length > 0);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="bg-royal-mahogany text-royal-bg">

      {/* Top CTA strip */}
      <div className="bg-royal-brown py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg font-bold text-royal-bg">Ready to furnish your space?</p>
            <p className="font-body text-royal-bg/80 text-sm">Custom orders welcome — handcrafted across Maharashtra, delivered across India.</p>
          </div>
          {waNumber && (
            <a href={`https://wa.me/${waNumber}?text=Hello%20Durva%20Woodcraft%2C%20I%27m%20interested%20in%20a%20custom%20furniture%20order!`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-royal-bg text-royal-mahogany font-semibold font-body text-sm whitespace-nowrap hover:bg-royal-cream transition-colors">
              Get a Free Quote <ArrowRight size={14} />
            </a>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand + Credentials */}
          <div>
            <h3 className="font-display text-2xl font-bold text-royal-bg mb-2">{settings.brand_name}</h3>
            <p className="font-body text-royal-bg/60 text-sm mb-5 leading-relaxed">{settings.tagline}</p>

            {/* Govt credentials — from DB, show only filled values */}
            <div className="space-y-2 mb-5">
              {settings.msme_number && (
                <div className="flex items-start gap-2 text-xs font-body">
                  <Award size={13} className="text-royal-gold mt-0.5 flex-shrink-0" />
                  <span className="text-royal-bg/75">
                    MSME / Udyam: <strong className="text-royal-bg font-semibold">{settings.msme_number}</strong>
                  </span>
                </div>
              )}
              {settings.gst_number && (
                <div className="flex items-start gap-2 text-xs font-body">
                  <Shield size={13} className="text-royal-gold mt-0.5 flex-shrink-0" />
                  <span className="text-royal-bg/75">
                    GSTIN: <strong className="text-royal-bg font-semibold">{settings.gst_number}</strong>
                  </span>
                </div>
              )}
              {settings.gem_seller_id && (
                <div className="flex items-start gap-2 text-xs font-body">
                  <span className="text-royal-gold flex-shrink-0">🏛</span>
                  <span className="text-royal-bg/75">
                    GeM: <strong className="text-royal-bg font-semibold">{settings.gem_seller_id}</strong>
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs font-body">
                <span className="text-royal-gold">🇮🇳</span>
                <span className="text-royal-bg/75">Make in India · PM Vishwakarma Certified</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              <span className="badge-msme">MSME Certified</span>
              <span className="badge-handmade">🪵 Make in India</span>
            </div>

            {socials.length > 0 && (
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-royal-bg/10 hover:bg-royal-brown transition-colors border border-royal-bg/20">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick + Govt links */}
          <div>
            <h4 className="font-display text-base font-bold text-royal-bg mb-5">Quick Links</h4>
            <ul className="space-y-3 mb-7">
              {quickLinks.map(({ label, id }) => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)}
                    className="font-body text-sm text-royal-bg/60 hover:text-royal-gold transition-colors flex items-center gap-1.5">
                    <ArrowRight size={12} />{label}
                  </button>
                </li>
              ))}
            </ul>
            <h4 className="font-display text-base font-bold text-royal-bg mb-4">Government Portals</h4>
            <ul className="space-y-3">
              {govLinks.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="font-body text-sm text-royal-bg/60 hover:text-royal-gold transition-colors flex items-center gap-1.5">
                    <ExternalLink size={11} />{label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — all from DB */}
          <div>
            <h4 className="font-display text-base font-bold text-royal-bg mb-5">Contact Us</h4>
            <div className="space-y-4 font-body text-sm text-royal-bg/60">
              {settings.address && (
                <div className="flex gap-2 items-start">
                  <MapPin size={14} className="text-royal-gold mt-0.5 flex-shrink-0" />
                  <span>{settings.address}</span>
                </div>
              )}
              {settings.phone_numbers?.[0] && (
                <a href={`tel:${settings.phone_numbers[0]}`}
                  className="flex gap-2 items-center hover:text-royal-gold transition-colors">
                  <Phone size={14} className="text-royal-gold flex-shrink-0" />
                  <span>{settings.phone_numbers[0]}</span>
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`}
                  className="flex gap-2 items-center hover:text-royal-gold transition-colors">
                  <Mail size={14} className="text-royal-gold flex-shrink-0" />
                  <span>{settings.email}</span>
                </a>
              )}
            </div>
            {waNumber && (
              <a href={`https://wa.me/${waNumber}?text=Hello%20Durva%20Woodcraft!`}
                target="_blank" rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold font-body text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#25D366' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.934 1.395 5.61L0 24l6.562-1.373A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.716.977.992-3.62-.235-.372A9.818 9.818 0 1112 21.818z"/>
                </svg>
                WhatsApp Us
              </a>
            )}
          </div>

          {/* Hours + Payment */}
          <div>
            <h4 className="font-display text-base font-bold text-royal-bg mb-5">Business Hours</h4>
            <div className="font-body text-sm text-royal-bg/60 space-y-1 mb-6">
              <p>Mon – Sat: 9:00 AM – 6:00 PM</p>
              <p>Sunday: Closed</p>
              <p className="text-royal-bg/40 text-xs mt-2">WhatsApp inquiries accepted 24/7</p>
            </div>
            <h4 className="font-display text-sm font-bold text-royal-bg mb-3">We Accept</h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {['UPI', 'PhonePe', 'GPay', 'Paytm', 'COD'].map(m => (
                <span key={m} className="text-xs font-body px-2.5 py-1 rounded bg-royal-bg/10 text-royal-bg/80 border border-royal-bg/20">{m}</span>
              ))}
            </div>
            <div className="bg-royal-bg/8 rounded-xl p-4 border border-royal-bg/15">
              <p className="font-body text-xs text-royal-gold font-semibold uppercase tracking-wider mb-1">Our Impact</p>
              <p className="font-body text-sm text-royal-bg/70 leading-relaxed">
                Supporting skilled craftsmen in Nashik, Maharashtra. Every purchase sustains traditional woodworking heritage.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-royal-bg/15 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-body text-royal-bg/40">
          <p>© {new Date().getFullYear()} {settings.brand_name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span>Handcrafted in Maharashtra 🪵</span>
            <span>·</span>
            <span>Pan-India Delivery</span>
            {settings.msme_number && <><span>·</span><span>MSME: {settings.msme_number}</span></>}
          </div>
        </div>
      </div>
    </footer>
  );
}
