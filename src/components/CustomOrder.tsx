import { useState } from 'react';
import { Send, CheckCircle, Ruler, Hammer, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSettings } from '../hooks/useSettings';

const FURNITURE_TYPES = ['Dining Table', 'Dining Chair', 'Sofa Frame', 'Bed Frame', 'Wardrobe', 'Office Desk', 'Bookshelf', 'TV Unit', 'Pooja Mandir', 'Coffee Table', 'Other'];
const WOOD_TYPES      = ['Sheesham (Rosewood)', 'Teak (Sagwan)', 'Mango Wood', 'Sal Wood', 'Not sure — suggest me'];
const FINISH_TYPES    = ['Natural Polish', 'Matte Finish', 'Glossy Finish', 'Walnut Stain', 'Mahogany Stain', 'White Paint', 'Custom Color'];
const BUDGET_RANGES   = ['Under ₹10,000', '₹10,000–₹25,000', '₹25,000–₹50,000', '₹50,000–₹1,00,000', 'Above ₹1,00,000', 'Flexible'];

export default function CustomOrder() {
  const { settings } = useSettings();
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    furniture_type: '', wood_type: '', finish: '',
    dimensions: '', budget_range: '', notes: '',
  });
  const [submitting, setSub] = useState(false);
  const [submitted, setSub2] = useState(false);
  const [error, setError]   = useState('');

  if (!settings) return null;

  const waNumber = (settings.whatsapp_number || settings.phone_numbers?.[0] || '').replace(/\D/g, '');

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSub(true);
    setError('');
    try {
      // 1. Save to custom_orders table
      const { error: dbErr } = await supabase.from('custom_orders').insert({
        name:           form.name,
        phone:          form.phone,
        email:          form.email || null,
        furniture_type: form.furniture_type,
        wood_type:      form.wood_type,
        finish:         form.finish,
        dimensions:     form.dimensions,
        budget_range:   form.budget_range,
        notes:          form.notes,
      });
      if (dbErr) throw dbErr;

      setSub2(true);

      // 2. Also open WhatsApp with pre-filled summary
      if (waNumber) {
        const msg = encodeURIComponent(
          `Hello Durva Woodcraft! I've submitted a Custom Order Request:\n\n` +
          `• Name: ${form.name}\n` +
          `• Furniture: ${form.furniture_type}\n` +
          `• Wood: ${form.wood_type}\n` +
          `• Finish: ${form.finish}\n` +
          `• Dimensions: ${form.dimensions || 'Flexible'}\n` +
          `• Budget: ${form.budget_range}\n` +
          `• Notes: ${form.notes || 'None'}\n\n` +
          `Please confirm and share a quote. Thank you!`
        );
        window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
      }

      setForm({ name: '', phone: '', email: '', furniture_type: '', wood_type: '', finish: '', dimensions: '', budget_range: '', notes: '' });
    } catch (err: any) {
      setError('Submission failed. Please send us a WhatsApp message directly.');
      console.error(err);
    } finally {
      setSub(false);
    }
  };

  const selectCls = 'w-full px-4 py-3 rounded-xl border border-royal-border bg-royal-bg font-body text-sm text-royal-mahogany focus:outline-none focus:border-royal-brown focus:ring-2 focus:ring-royal-brown/15 transition-all appearance-none cursor-pointer';
  const inputCls  = 'w-full px-4 py-3 rounded-xl border border-royal-border bg-royal-bg font-body text-sm text-royal-mahogany placeholder-royal-navy/30 focus:outline-none focus:border-royal-brown focus:ring-2 focus:ring-royal-brown/15 transition-all';
  const labelCls  = 'block font-body text-xs font-semibold text-royal-navy uppercase tracking-widest mb-1.5';

  return (
    <section id="custom-order" className="py-20 bg-royal-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-body text-royal-brown font-semibold text-xs uppercase tracking-widest mb-3">Made Just for You</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-royal-mahogany mb-4">
            Request a Custom Order
          </h2>
          <p className="font-body text-royal-navy/60 max-w-xl mx-auto">
            Tell us what you need — we'll craft it exactly to your specifications.
            We'll contact you with a quote within 24 hours.
          </p>
          <hr className="royal-divider w-20 mx-auto mt-6" />
        </div>

        {submitted ? (
          <div className="text-center py-16 bg-royal-surface/50 rounded-2xl border border-royal-border">
            <div className="w-20 h-20 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3 className="font-display text-2xl font-bold text-royal-mahogany mb-3">Order Request Submitted!</h3>
            <p className="font-body text-royal-navy/60 mb-2 max-w-md mx-auto">
              Your custom order details have been saved. We've also opened WhatsApp with a summary — confirm there for fastest response.
            </p>
            <p className="font-body text-sm text-royal-brown font-semibold mb-8">
              Expected quote: within 24 hours
            </p>
            <button onClick={() => setSub2(false)}
              className="font-body text-sm text-royal-navy/50 hover:text-royal-navy/80 transition-colors underline">
              Submit another request
            </button>
          </div>
        ) : (
          <div className="bg-royal-bg rounded-2xl border border-royal-border shadow-royal-md overflow-hidden">

            {/* Step indicators */}
            <div className="bg-royal-surface/40 px-8 py-4 border-b border-royal-border">
              <div className="flex items-center gap-6 text-xs font-body font-semibold text-royal-navy/50">
                {[
                  { icon: Hammer, label: 'Furniture Details' },
                  { icon: Ruler, label: 'Dimensions & Budget' },
                  { icon: MessageCircle, label: 'Contact & Submit' },
                ].map(({ icon: Icon, label }, i) => (
                  <div key={label} className="flex items-center gap-1.5 text-royal-brown">
                    <Icon size={13} />
                    <span>{label}</span>
                    {i < 2 && <span className="ml-4 text-royal-border">—</span>}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">

              {/* Section 1: Furniture specs */}
              <div>
                <h3 className="font-display text-lg font-bold text-royal-mahogany mb-4">Furniture Details</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Furniture Type *</label>
                    <select className={selectCls} required value={form.furniture_type} onChange={e => set('furniture_type', e.target.value)}>
                      <option value="">Select type...</option>
                      {FURNITURE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Wood Preference *</label>
                    <select className={selectCls} required value={form.wood_type} onChange={e => set('wood_type', e.target.value)}>
                      <option value="">Select wood...</option>
                      {WOOD_TYPES.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Finish Type *</label>
                    <select className={selectCls} required value={form.finish} onChange={e => set('finish', e.target.value)}>
                      <option value="">Select finish...</option>
                      {FINISH_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Dimensions & budget */}
              <div className="pt-4 border-t border-royal-border">
                <h3 className="font-display text-lg font-bold text-royal-mahogany mb-4">Dimensions & Budget</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Dimensions (L × W × H)</label>
                    <input className={inputCls} type="text"
                      value={form.dimensions} onChange={e => set('dimensions', e.target.value)}
                      placeholder="e.g. 6ft × 3ft × 30in — or leave blank if flexible" />
                    <p className="font-body text-xs text-royal-navy/40 mt-1">Leave blank if you want us to suggest standard sizes</p>
                  </div>
                  <div>
                    <label className={labelCls}>Budget Range *</label>
                    <select className={selectCls} required value={form.budget_range} onChange={e => set('budget_range', e.target.value)}>
                      <option value="">Select budget...</option>
                      {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className={labelCls}>Additional Notes</label>
                  <textarea className={inputCls + ' resize-none'} rows={3}
                    value={form.notes} onChange={e => set('notes', e.target.value)}
                    placeholder="Any special requirements, reference images, colour preferences, delivery location..." />
                </div>
              </div>

              {/* Section 3: Contact info */}
              <div className="pt-4 border-t border-royal-border">
                <h3 className="font-display text-lg font-bold text-royal-mahogany mb-4">Your Contact Details</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Full Name *</label>
                    <input className={inputCls} type="text" required
                      value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="Rahul Sharma" />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number *</label>
                    <input className={inputCls} type="tel" required
                      value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="9823XXXXXX" />
                  </div>
                  <div>
                    <label className={labelCls}>Email (optional)</label>
                    <input className={inputCls} type="email"
                      value={form.email} onChange={e => set('email', e.target.value)}
                      placeholder="rahul@example.com" />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-body text-sm text-red-700">{error}</div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button type="submit" disabled={submitting}
                  className="flex-1 royal-btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-base">
                  {submitting
                    ? <div className="w-5 h-5 border-2 border-royal-bg/30 border-t-royal-bg rounded-full animate-spin" />
                    : <Send size={18} />}
                  {submitting ? 'Submitting...' : 'Submit Custom Order Request'}
                </button>
                {waNumber && (
                  <a href={`https://wa.me/${waNumber}?text=Hello%20Durva%20Woodcraft%2C%20I%27d%20like%20to%20place%20a%20custom%20order!`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 font-body font-semibold text-sm transition-all hover:text-white"
                    style={{ borderColor: '#25D366', color: '#25D366' }}
                    onMouseOver={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#25D366'; }}
                    onMouseOut={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}>
                    <MessageCircle size={18} />
                    Chat on WhatsApp
                  </a>
                )}
              </div>

              <p className="font-body text-xs text-royal-navy/40 text-center">
                Submitting this form also opens WhatsApp with your order summary for instant confirmation.
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
