import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSettings } from '../hooks/useSettings';

export default function Contact() {
  const { settings } = useSettings();
  const [form, setForm]     = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSub] = useState(false);
  const [submitted, setSub2] = useState(false);
  const [error, setError]   = useState('');

  if (!settings) return null;

  const waNumber = (settings.whatsapp_number || settings.phone_numbers?.[0] || '').replace(/\D/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSub(true);
    setError('');
    try {
      const { error: dbErr } = await supabase.from('inquiries').insert({
        name:    form.name,
        phone:   form.phone,
        email:   form.email || null,
        message: form.message,
        source:  'contact_form',
      });
      if (dbErr) throw dbErr;
      setSub2(true);
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch (err: any) {
      setError('Something went wrong. Please try WhatsApp instead.');
      console.error(err);
    } finally {
      setSub(false);
    }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-royal-border bg-royal-bg font-body text-sm text-royal-mahogany placeholder-royal-navy/30 focus:outline-none focus:border-royal-brown focus:ring-2 focus:ring-royal-brown/15 transition-all';
  const labelCls = 'block font-body text-xs font-semibold text-royal-navy uppercase tracking-widest mb-1.5';

  return (
    <section id="contact" className="py-20 bg-royal-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-body text-royal-brown font-semibold text-xs uppercase tracking-widest mb-3">Get in Touch</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-royal-mahogany mb-4">
            Let's Build Something Beautiful
          </h2>
          <p className="font-body text-royal-navy/60 max-w-xl mx-auto">
            Share your requirement and we'll get back to you within 24 hours with a quote and timeline.
          </p>
          <hr className="royal-divider w-20 mx-auto mt-6" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Contact info cards */}
          <div className="space-y-5">
            {[
              {
                icon: Phone, title: 'Call Us',
                lines: settings.phone_numbers?.map(p => ({ text: p, href: `tel:${p}` })) || [],
                note: 'Mon–Sat, 9AM–6PM'
              },
              {
                icon: Mail, title: 'Email Us',
                lines: [{ text: settings.email, href: `mailto:${settings.email}` }],
                note: 'We reply within 24 hours'
              },
              {
                icon: MapPin, title: 'Our Workshop',
                lines: [{ text: settings.address, href: null }],
                note: 'Visit by appointment'
              },
            ].map(({ icon: Icon, title, lines, note }) => (
              <div key={title} className="flex gap-4 p-5 bg-royal-bg rounded-2xl border border-royal-border shadow-royal-sm">
                <div className="w-11 h-11 rounded-xl bg-royal-mahogany flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-royal-bg" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-royal-mahogany mb-1">{title}</h3>
                  {lines.map(({ text, href }) =>
                    href ? (
                      <a key={text} href={href} className="block font-body text-sm text-royal-brown hover:text-royal-mahogany transition-colors">{text}</a>
                    ) : (
                      <p key={text} className="font-body text-sm text-royal-navy/70">{text}</p>
                    )
                  )}
                  <p className="font-body text-xs text-royal-navy/40 mt-1">{note}</p>
                </div>
              </div>
            ))}

            {/* WhatsApp CTA */}
            {waNumber && (
              <a href={`https://wa.me/${waNumber}?text=Hello%20Durva%20Woodcraft%2C%20I%27d%20like%20to%20discuss%20a%20furniture%20requirement.`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-5 rounded-2xl text-white transition-all hover:opacity-95 hover:shadow-lg"
                style={{ backgroundColor: '#25D366' }}>
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-display text-base font-bold">Chat on WhatsApp</p>
                  <p className="font-body text-sm opacity-90">Fastest response — usually within minutes</p>
                </div>
              </a>
            )}
          </div>

          {/* Contact form */}
          <div className="bg-royal-bg rounded-2xl border border-royal-border shadow-royal-md p-8">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="font-display text-xl font-bold text-royal-mahogany mb-2">Message Sent!</h3>
                <p className="font-body text-royal-navy/60 mb-6 max-w-sm">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                {waNumber && (
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
                    className="font-body text-sm text-royal-brown hover:text-royal-mahogany transition-colors flex items-center gap-1.5">
                    <MessageCircle size={14} /> Or chat on WhatsApp for faster response
                  </a>
                )}
                <button onClick={() => setSub2(false)} className="mt-4 font-body text-xs text-royal-navy/40 hover:text-royal-navy/70 transition-colors">
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-display text-xl font-bold text-royal-mahogany mb-6">Send Us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Your Name *</label>
                      <input className={inputCls} type="text" required
                        value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Rahul Sharma" />
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number *</label>
                      <input className={inputCls} type="tel" required
                        value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="9823XXXXXX" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Email (optional)</label>
                    <input className={inputCls} type="email"
                      value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="rahul@example.com" />
                  </div>
                  <div>
                    <label className={labelCls}>Your Message *</label>
                    <textarea className={inputCls + ' resize-none'} rows={4} required
                      value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us about the furniture you need — type, size, wood preference, timeline..." />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-body text-sm text-red-700">{error}</div>
                  )}

                  <button type="submit" disabled={submitting}
                    className="w-full royal-btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting
                      ? <div className="w-4 h-4 border-2 border-royal-bg/30 border-t-royal-bg rounded-full animate-spin" />
                      : <Send size={16} />}
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>

                  <p className="font-body text-xs text-royal-navy/40 text-center">
                    Or reach us directly on WhatsApp for instant response.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
