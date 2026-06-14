import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  if (!settings) return null;

  const waNumber = settings.phone_numbers?.[0]?.replace(/\D/g, '') || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setStatus('sending');
    try {
      const { error } = await supabase.from('inquiries').insert([{
        name: form.name,
        email: form.email || null,
        phone: form.phone,
        message: form.message,
        created_at: new Date().toISOString(),
      }]);
      if (error) throw error;
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 bg-royal-surface/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="font-body text-royal-brown font-semibold text-sm uppercase tracking-widest mb-3">
            Reach Us
          </p>
          <h2 className="section-heading font-display text-4xl font-bold text-royal-mahogany mb-6">
            Get in Touch
          </h2>
          <hr className="royal-divider w-24 mt-10 mb-4" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Contact Form */}
          <div className="bg-royal-bg rounded-2xl p-8 shadow-royal-sm border border-royal-border">
            <h3 className="font-display text-2xl font-bold text-royal-mahogany mb-6">
              Send us a Message
            </h3>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-48 gap-4 text-center">
                <CheckCircle size={48} className="text-green-500" />
                <p className="font-display text-xl font-bold text-royal-mahogany">Message Received!</p>
                <p className="font-body text-royal-navy/70">We'll reply within 24 hours. You can also WhatsApp us for a faster response.</p>
                <button onClick={() => setStatus('idle')} className="text-sm text-royal-brown underline">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name" value={form.name} onChange={handleChange}
                  type="text" placeholder="Your Name *" required
                  className="w-full px-4 py-3 rounded-xl border border-royal-border bg-royal-cream font-body text-royal-mahogany placeholder-royal-navy/40 focus:outline-none focus:border-royal-brown"
                />
                <input
                  name="email" value={form.email} onChange={handleChange}
                  type="email" placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-xl border border-royal-border bg-royal-cream font-body text-royal-mahogany placeholder-royal-navy/40 focus:outline-none focus:border-royal-brown"
                />
                <input
                  name="phone" value={form.phone} onChange={handleChange}
                  type="tel" placeholder="Phone Number *" required
                  className="w-full px-4 py-3 rounded-xl border border-royal-border bg-royal-cream font-body text-royal-mahogany placeholder-royal-navy/40 focus:outline-none focus:border-royal-brown"
                />
                <textarea
                  name="message" value={form.message} onChange={handleChange}
                  placeholder="Your Message or Requirement" rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-royal-border bg-royal-cream font-body text-royal-mahogany placeholder-royal-navy/40 focus:outline-none focus:border-royal-brown resize-none"
                />
                {status === 'error' && (
                  <p className="text-red-500 text-sm font-body">Something went wrong. Please try WhatsApp instead.</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full royal-btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending...' : (<><Send size={16} /> Send Message</>)}
                </button>
              </form>
            )}

            {/* OR WhatsApp */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-royal-border" />
              <span className="font-body text-sm text-royal-navy/50">or faster via</span>
              <div className="flex-1 h-px bg-royal-border" />
            </div>
            <a
              href={`https://wa.me/${waNumber}?text=Hello%20Durva%20Woodcraft%2C%20I%27m%20interested%20in%20your%20furniture.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold font-body text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: '#25D366' }}
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-royal-bg rounded-2xl p-8 shadow-royal-sm border border-royal-border">
              <h3 className="font-display text-2xl font-bold text-royal-mahogany mb-6">Contact Information</h3>
              <div className="space-y-5">
                {[
                  { icon: MapPin, title: 'Address',        content: settings.address },
                  { icon: Phone,  title: 'Phone',          content: settings.phone_numbers.join(' / ') },
                  { icon: Mail,   title: 'Email',          content: settings.email },
                  { icon: Clock,  title: 'Business Hours', content: 'Monday – Saturday: 9:00 AM – 6:00 PM' },
                ].map(({ icon: Icon, title, content }) => (
                  <div key={title} className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-royal-mahogany text-royal-bg flex-shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-body font-semibold text-royal-mahogany text-sm">{title}</p>
                      <p className="font-body text-royal-navy/70 text-sm">{content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* UPI Payment info */}
            <div className="bg-royal-navy rounded-2xl p-6 border border-royal-border">
              <h4 className="font-display text-lg font-bold text-royal-bg mb-2">💳 Payment Options</h4>
              <p className="font-body text-royal-bg/70 text-sm mb-4">
                We accept UPI payments via PhonePe, GPay, and Paytm. Pay after order confirmation — simple and secure.
              </p>
              <div className="flex flex-wrap gap-2">
                {['PhonePe', 'Google Pay', 'Paytm', 'Bank Transfer', 'Cash on Delivery'].map(m => (
                  <span key={m} className="text-xs font-semibold font-body px-3 py-1.5 rounded-full bg-white/15 text-royal-bg border border-white/20">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
