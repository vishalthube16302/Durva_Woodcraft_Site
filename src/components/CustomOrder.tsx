import { useState } from 'react';
import { Ruler, Palette, Trees, Send, CheckCircle, MessageCircle } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { supabase } from '../lib/supabase';

const WOOD_TYPES = ['Sheesham (Rosewood)', 'Teak', 'Mango Wood', 'Sal Wood', 'Pine', 'Other (mention in notes)'];
const FINISHES   = ['Natural Polish', 'Walnut Stain', 'Mahogany Stain', 'Painted (White)', 'Lacquer Finish', 'Oil Finish'];
const FURNITURE  = ['Dining Table', 'Sofa / Sofa-cum-Bed', 'Bed Frame', 'Wardrobe', 'TV Unit', 'Study Table', 'Office Desk', 'Chair', 'Bookshelf', 'Pooja Mandir', 'Other'];

export default function CustomOrder() {
  const { settings } = useSettings();
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    furniture_type: '', wood_type: '', finish: '',
    dimensions: '', notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  if (!settings) return null;

  const waNumber = settings.phone_numbers?.[0]?.replace(/\D/g, '') || '';

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const { error } = await supabase.from('custom_orders').insert([{
        ...form,
        created_at: new Date().toISOString(),
      }]);
      if (error) throw error;
      setStatus('success');

      // Also open WhatsApp with prefilled message
      const msg = encodeURIComponent(
        `Hello Durva Woodcraft! I'd like a custom ${form.furniture_type} in ${form.wood_type} wood with ${form.finish} finish. Dimensions: ${form.dimensions}. Name: ${form.name}, Phone: ${form.phone}.`
      );
      window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
    } catch {
      setStatus('error');
    }
  };

  const steps = [
    { icon: MessageCircle, title: 'Share Your Idea',     desc: 'Tell us what you need — furniture type, size, wood, finish.' },
    { icon: Ruler,         title: 'We Design for You',  desc: 'Our craftsmen will suggest the best design and give a quote.' },
    { icon: Trees,         title: 'We Craft It',         desc: 'Your furniture is handmade with premium wood in our workshop.' },
    { icon: Palette,       title: 'Delivered to You',   desc: 'Carefully packed and delivered to your doorstep across India.' },
  ];

  return (
    <section id="custom-order" className="py-20 bg-royal-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="font-body text-royal-saffron font-semibold text-sm uppercase tracking-widest mb-3">
            Bespoke Furniture
          </p>
          <h2 className="section-heading font-display text-4xl font-bold text-royal-mahogany mb-6">
            Custom Order
          </h2>
          <hr className="royal-divider w-24 mt-10 mb-4" />
          <p className="font-body text-royal-navy/70 max-w-xl mx-auto">
            Have a specific design in mind? We build furniture to your exact size, wood type, and finish — completely custom, completely handmade.
          </p>
        </div>

        {/* Process steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="text-center p-5 rounded-2xl bg-royal-surface border border-royal-border">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-royal-saffron flex items-center justify-center text-white">
                <Icon size={22} />
              </div>
              <p className="font-body text-xs text-royal-saffron font-semibold mb-1">Step {i + 1}</p>
              <h4 className="font-display text-sm font-bold text-royal-mahogany mb-1">{title}</h4>
              <p className="font-body text-xs text-royal-navy/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Form */}
          <div className="bg-royal-surface rounded-2xl p-8 shadow-royal-sm border border-royal-border">
            <h3 className="font-display text-2xl font-bold text-royal-mahogany mb-6">
              Tell Us What You Need
            </h3>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-56 gap-4 text-center">
                <CheckCircle size={52} className="text-green-500" />
                <p className="font-display text-xl font-bold text-royal-mahogany">Order Request Received!</p>
                <p className="font-body text-royal-navy/70 text-sm">
                  We've opened WhatsApp for you. If it didn't open, call us directly.
                </p>
                <button onClick={() => setStatus('idle')} className="text-sm text-royal-saffron underline">Submit another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input name="name" value={form.name} onChange={change} placeholder="Your Name *" required
                    className="px-4 py-3 rounded-xl border border-royal-border bg-royal-cream font-body text-royal-mahogany placeholder-royal-navy/40 focus:outline-none focus:border-royal-saffron col-span-2 sm:col-span-1" />
                  <input name="phone" value={form.phone} onChange={change} placeholder="Phone Number *" required type="tel"
                    className="px-4 py-3 rounded-xl border border-royal-border bg-royal-cream font-body text-royal-mahogany placeholder-royal-navy/40 focus:outline-none focus:border-royal-saffron col-span-2 sm:col-span-1" />
                </div>
                <input name="email" value={form.email} onChange={change} placeholder="Email (optional)" type="email"
                  className="w-full px-4 py-3 rounded-xl border border-royal-border bg-royal-cream font-body text-royal-mahogany placeholder-royal-navy/40 focus:outline-none focus:border-royal-saffron" />
                <select name="furniture_type" value={form.furniture_type} onChange={change} required
                  className="w-full px-4 py-3 rounded-xl border border-royal-border bg-royal-cream font-body text-royal-mahogany focus:outline-none focus:border-royal-saffron">
                  <option value="">Select Furniture Type *</option>
                  {FURNITURE.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <select name="wood_type" value={form.wood_type} onChange={change}
                    className="px-4 py-3 rounded-xl border border-royal-border bg-royal-cream font-body text-royal-mahogany focus:outline-none focus:border-royal-saffron">
                    <option value="">Wood Type</option>
                    {WOOD_TYPES.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                  <select name="finish" value={form.finish} onChange={change}
                    className="px-4 py-3 rounded-xl border border-royal-border bg-royal-cream font-body text-royal-mahogany focus:outline-none focus:border-royal-saffron">
                    <option value="">Finish Type</option>
                    {FINISHES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <input name="dimensions" value={form.dimensions} onChange={change} placeholder="Dimensions (e.g. 6ft x 3ft x 2.5ft)"
                  className="w-full px-4 py-3 rounded-xl border border-royal-border bg-royal-cream font-body text-royal-mahogany placeholder-royal-navy/40 focus:outline-none focus:border-royal-saffron" />
                <textarea name="notes" value={form.notes} onChange={change} rows={3} placeholder="Any special requirements, reference images, or notes..."
                  className="w-full px-4 py-3 rounded-xl border border-royal-border bg-royal-cream font-body text-royal-mahogany placeholder-royal-navy/40 focus:outline-none focus:border-royal-saffron resize-none" />

                {status === 'error' && <p className="text-red-500 text-sm font-body">Something went wrong. Please WhatsApp us directly.</p>}

                <button type="submit" disabled={status === 'sending'}
                  className="w-full royal-btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
                  {status === 'sending' ? 'Submitting...' : (<><Send size={16} /> Submit & Open WhatsApp</>)}
                </button>
              </form>
            )}
          </div>

          {/* Why custom order */}
          <div className="space-y-6">
            <div className="bg-royal-navy rounded-2xl p-7">
              <h4 className="font-display text-xl font-bold text-royal-bg mb-4">Why Custom Order?</h4>
              <ul className="space-y-3 font-body text-sm text-royal-bg/75">
                {[
                  'Perfect fit for your room dimensions',
                  'Choose your own wood type and finish',
                  'Unique design — no one else has the same piece',
                  'Same price as ready-made, better quality',
                  'Pan-India delivery with safe packaging',
                  'MSME certified — eligible for institutional orders',
                ].map(point => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="text-royal-gold mt-0.5">✦</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-royal-surface rounded-2xl p-7 border border-royal-border">
              <h4 className="font-display text-lg font-bold text-royal-mahogany mb-3">Delivery Timeline</h4>
              <div className="space-y-3">
                {[
                  { label: 'Standard Items',  time: '5–7 business days' },
                  { label: 'Custom Orders',   time: '14–21 business days' },
                  { label: 'Bulk / Govt Orders', time: 'As per agreement' },
                ].map(({ label, time }) => (
                  <div key={label} className="flex justify-between items-center border-b border-royal-border pb-2 last:border-0 last:pb-0">
                    <span className="font-body text-sm text-royal-navy/70">{label}</span>
                    <span className="font-body text-sm font-semibold text-royal-saffron">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
