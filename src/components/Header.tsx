import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, Home, Package, Info, MessageCircle, Hammer, ChevronUp } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { getImageUrl } from '../utils/imageUtils';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home',         label: 'Home',         icon: Home },
    { id: 'products',     label: 'Products',     icon: Package },
    { id: 'custom-order', label: 'Custom Order', icon: Hammer },
    { id: 'about',        label: 'About Us',     icon: Info },
    { id: 'contact',      label: 'Contact',      icon: Phone },
  ];

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const id = location.hash.replace('#', '');
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 88;
          window.scrollTo({ top: y, behavior: 'smooth' });
          setActiveSection(id);
        } else if (attempts < 20) { attempts++; setTimeout(tryScroll, 100); }
      };
      setTimeout(tryScroll, 100);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY;
      setIsScrolled(sy > 20);
      setShowBackTop(sy > 600);
      if (location.pathname !== '/') return;
      if (sy < 50) { setActiveSection('home'); return; }
      const scrollPos = sy + 110;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(item.id);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    if (location.pathname !== '/') { navigate(`/#${id}`); return; }
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth' }); setActiveSection(id); }
  };

  if (!settings) return null;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-royal-bg shadow-royal-md border-b border-royal-border'
          : 'bg-royal-bg/96 backdrop-blur-sm'
      }`}>

        {/* Top info bar */}
        <div className="hidden lg:block bg-royal-navy text-royal-bg text-xs py-1.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <a href={`tel:${settings.phone_numbers?.[0]}`} className="flex items-center gap-1.5 hover:text-royal-gold transition-colors">
                <Phone size={12} />
                {settings.phone_numbers?.[0]}
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 hover:text-royal-gold transition-colors">
                <Mail size={12} />
                {settings.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge-handmade">🪵 Handcrafted in Maharashtra</span>
              <span className="badge-msme">MSME Registered</span>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">

            {/* Logo + Brand */}
            <button onClick={() => scrollToSection('home')} className="flex items-center gap-3 group">
              {settings.logo_url && (
                <img
                  src={getImageUrl(settings.logo_url)}
                  alt={settings.brand_name}
                  className="h-12 w-auto object-contain"
                />
              )}
              <div className="text-left">
                <div className="font-display text-xl font-bold text-royal-mahogany leading-tight group-hover:text-royal-brown transition-colors">
                  {settings.brand_name}
                </div>
                <div className="text-xs text-royal-gold font-body tracking-wide">
                  {settings.tagline}
                </div>
              </div>
            </button>

            {/* Desktop Nav — NO admin link */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body font-semibold transition-all duration-200 ${
                      active
                        ? 'bg-royal-brown text-royal-bg shadow-md'
                        : 'text-royal-mahogany hover:bg-royal-surface hover:text-royal-brown'
                    }`}
                  >
                    <Icon size={14} />
                    {item.label}
                  </button>
                );
              })}
              <a
                href={`https://wa.me/${settings.phone_numbers?.[0]?.replace(/\D/g, '')}?text=Hello%20Durva%20Woodcraft%2C%20I%27m%20interested%20in%20your%20furniture!`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white ml-2 transition-all hover:opacity-90 hover:shadow-md"
                style={{ backgroundColor: '#25D366' }}
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            </nav>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-royal-mahogany"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-royal-bg border-t border-royal-border shadow-royal-md">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? 'bg-royal-brown text-royal-bg'
                        : 'text-royal-mahogany hover:bg-royal-surface'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
              <a
                href={`https://wa.me/${settings.phone_numbers?.[0]?.replace(/\D/g, '')}?text=Hello%20Durva%20Woodcraft%21`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold mt-2 hover:opacity-90"
                style={{ backgroundColor: '#25D366' }}
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Back-to-top button */}
      {showBackTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-6 z-40 w-10 h-10 rounded-full bg-royal-mahogany text-royal-bg flex items-center justify-center shadow-royal-md hover:bg-royal-brown transition-colors"
          aria-label="Back to top"
        >
          <ChevronUp size={18} />
        </button>
      )}
    </>
  );
}
