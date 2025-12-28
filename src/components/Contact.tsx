import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export default function Contact() {
  const { settings } = useSettings();

  if (!settings) return null;

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: settings.primary_color }}>
            Get in Touch
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6" style={{ color: settings.primary_color }}>
              Send us a Message
            </h3>
            <form className="space-y-6">
              <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-lg border border-gray-300" />
              <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-lg border border-gray-300" />
              <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 rounded-lg border border-gray-300" />
              <textarea placeholder="Message" rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 resize-none"></textarea>
              <button
                type="submit"
                className="w-full py-4 rounded-lg text-white font-medium"
                style={{ backgroundColor: settings.primary_color }}
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6" style={{ color: settings.primary_color }}>
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: settings.primary_color }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Address</h4>
                    <p className="text-gray-600">{settings.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: settings.primary_color }}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    {settings.phone_numbers.map((phone, i) => (
                      <p key={i} className="text-gray-600">{phone}</p>
                    ))}
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: settings.primary_color }}>
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-gray-600">{settings.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: settings.primary_color }}>
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Business Hours</h4>
                    <p className="text-gray-600">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
