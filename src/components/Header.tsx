import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, Home, Package, Info } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { getImageUrl } from '../utils/imageUtils';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  useEffect(() => {
    // Check for hash in URL to scroll after navigation
    if (location.pathname === '/' && location.hash) {
      const id = location.hash.replace('#', '');

      // Retry mechanism to wait for content to load
      let attempts = 0;
      const maxAttempts = 20; // 2 seconds max

      const tryScroll = () => {
        const element = document.getElementById(id);
        if (element) {
          // Add a small offset for the fixed header
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
          setActiveSection(id);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryScroll, 100);
        }
      };

      // Initial small delay to allow partial rendering
      setTimeout(tryScroll, 100);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (location.pathname !== '/') return;

      const scrollPosition = window.scrollY + 100;

      // Default to home if at top
      if (window.scrollY < 50) {
        setActiveSection('home');
        return;
      }

      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
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

    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Update active section immediately for better UX
      setActiveSection(id);
    }
  };

  if (!settings) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            {settings.logo_url && (
              <img
                src={getImageUrl(settings.logo_url)}
                alt={settings.brand_name}
                className="h-12 w-auto object-contain"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold" style={{ color: settings.primary_color }}>
                {settings.brand_name}
              </h1>
              <p className="text-sm text-gray-600">{settings.tagline}</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 font-medium text-sm ${isActive
                    ? 'text-white shadow-md transform scale-105'
                    : 'text-gray-700 hover:bg-gray-100/50'
                    }`}
                  style={isActive ? { backgroundColor: settings.primary_color } : {}}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <a
              href="/admin"
              className="px-6 py-2 rounded-full text-white transition-all hover:shadow-lg ml-4 text-sm font-medium"
              style={{ backgroundColor: settings.primary_color }}
            >
              Admin
            </a>
          </nav>

          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${isActive
                    ? 'text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  style={isActive ? { backgroundColor: settings.primary_color } : {}}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            <a
              href="/admin"
              className="block w-full text-center px-4 py-3 rounded-xl text-white mt-4 font-medium shadow-md text-sm"
              style={{ backgroundColor: settings.primary_color }}
            >
              Admin Panel
            </a>
          </div>
        </div>
      )}

      <div className="hidden lg:block border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>{settings.phone_numbers[0]}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>{settings.email}</span>
              </div>
            </div>
            <div>{settings.address}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
