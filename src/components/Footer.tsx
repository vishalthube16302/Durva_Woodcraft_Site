import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function Footer() {
  const { settings } = useSettings();

  if (!settings) return null;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: settings.accent_color }}>
              {settings.brand_name}
            </h3>
            <p className="text-gray-400 mb-4">{settings.tagline}</p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: settings.primary_color }}>
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: settings.primary_color }}>
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: settings.primary_color }}>
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Products</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-400 text-sm">{settings.address}</p>
            <p className="text-gray-400 text-sm">{settings.phone_numbers[0]}</p>
            <p className="text-gray-400 text-sm">{settings.email}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Hours</h4>
            <p className="text-gray-400 text-sm">Mon - Sat: 9AM - 6PM</p>
            <p className="text-gray-400 text-sm">Sunday: Closed</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {settings.brand_name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
