import { useState, useEffect } from 'react';
import { Save, CheckCircle, AlertCircle, Award, Globe, Phone, Mail, MapPin, Link, Building2 } from 'lucide-react';
import { supabase, Settings } from '../../lib/supabase';
import { useSettings } from '../../hooks/useSettings';

export default function SettingsPanel() {
  const { settings: current, refetch } = useSettings();
  const [form, setForm]     = useState<Partial<Settings>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { if (current) setForm(current); }, [current]);

  const set = (key: keyof Settings, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const { error } = await supabase
        .from('settings')
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq('id', current?.id);
      if (error) throw error;
      setMsg({ type: 'success', text: 'Settings saved successfully!' });
      refetch();
    } catch {
      setMsg({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (!current) return null;

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-royal-border bg-royal-cream font-body text-sm text-royal-mahogany placeholder-royal-navy/30 focus:outline-none focus:border-royal-brown focus:ring-2 focus:ring-royal-brown/15 transition-all';
  const labelCls = 'block font-body text-xs font-semibold text-royal-navy uppercase tracking-widest mb-1.5';

  const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
    <div className="bg-royal-bg rounded-2xl border border-royal-border p-6 space-y-4">
      <div className="flex items-center gap-2.5 pb-4 border-b border-royal-border">
        <div className="w-8 h-8 rounded-lg bg-royal-surface flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-royal-brown" />
        </div>
        <h3 className="font-display text-base font-bold text-royal-mahogany">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-royal-mahogany">Website Settings</h2>
        <p className="font-body text-sm text-royal-navy/50 mt-1">
          All fields update the live website instantly after saving.
        </p>
      </div>

      {msg && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border font-body text-sm ${
          msg.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {msg.type === 'success'
            ? <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
            : <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
          }
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Brand ─────────────────────────────────────────────── */}
        <Section icon={Globe} title="Brand Identity">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Brand Name</label>
              <input className={inputCls} type="text" value={form.brand_name || ''} onChange={e => set('brand_name', e.target.value)} placeholder="Durva Woodcraft" />
            </div>
            <div>
              <label className={labelCls}>Tagline</label>
              <input className={inputCls} type="text" value={form.tagline || ''} onChange={e => set('tagline', e.target.value)} placeholder="Honoring Nature, Crafting Life" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Logo (filename or URL)</label>
            <input className={inputCls} type="text" value={form.logo_url || ''} onChange={e => set('logo_url', e.target.value)} placeholder="logo.png" />
            <p className="font-body text-xs text-royal-navy/40 mt-1">Upload to <code>public/images/</code> and enter filename. Or paste a full URL.</p>
          </div>
        </Section>

        {/* ── Contact ───────────────────────────────────────────── */}
        <Section icon={Phone} title="Contact Details">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Phone Number (call)</label>
              <input className={inputCls} type="tel" value={form.phone_numbers?.[0] || ''} onChange={e => set('phone_numbers', [e.target.value] as any)} placeholder="+91 9XXXXXXXXX" />
            </div>
            <div>
              <label className={labelCls}>WhatsApp Number</label>
              <input className={inputCls} type="tel" value={form.whatsapp_number || ''} onChange={e => set('whatsapp_number', e.target.value)} placeholder="919XXXXXXXXX (with country code, no +)" />
              <p className="font-body text-xs text-royal-navy/40 mt-1">Used for all WhatsApp links. Format: 919XXXXXXXXX</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Email Address</label>
              <input className={inputCls} type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} placeholder="contact@durvawoodcraft.in" />
            </div>
            <div>
              <label className={labelCls}>Website URL</label>
              <input className={inputCls} type="url" value={form.website || ''} onChange={e => set('website', e.target.value)} placeholder="https://durvawoodcraft.in" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Full Address</label>
            <textarea className={inputCls + ' resize-none'} rows={2} value={form.address || ''} onChange={e => set('address', e.target.value)} placeholder="Workshop address, Nashik, Maharashtra 422001" />
          </div>
        </Section>

        {/* ── Government Credentials ────────────────────────────── */}
        <Section icon={Award} title="Government & Business Credentials">
          <div className="bg-royal-surface/50 rounded-xl p-4 border border-royal-border mb-2">
            <p className="font-body text-xs text-royal-navy/60 leading-relaxed">
              These appear on the website's footer, About section, and Government/Bulk Orders page.
              Government officers verify these numbers — keep them accurate.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>MSME / Udyam Number</label>
              <input className={inputCls} type="text" value={form.msme_number || ''} onChange={e => set('msme_number', e.target.value)} placeholder="MH-01-0084519" />
              <p className="font-body text-xs text-royal-navy/40 mt-1">Your confirmed number: MH-01-0084519</p>
            </div>
            <div>
              <label className={labelCls}>GST Number (GSTIN)</label>
              <input className={inputCls} type="text" value={form.gst_number || ''} onChange={e => set('gst_number', e.target.value)} placeholder="27XXXXXXXXXXXXX" />
              <p className="font-body text-xs text-royal-navy/40 mt-1">15-digit GSTIN from GST portal</p>
            </div>
            <div>
              <label className={labelCls}>GeM Seller ID</label>
              <input className={inputCls} type="text" value={form.gem_seller_id || ''} onChange={e => set('gem_seller_id', e.target.value)} placeholder="GeM-XXXX-XXXX" />
              <p className="font-body text-xs text-royal-navy/40 mt-1">Leave blank until registered on gem.gov.in</p>
            </div>
          </div>
        </Section>

        {/* ── Social Media ──────────────────────────────────────── */}
        <Section icon={Link} title="Social Media Links">
          <div className="bg-royal-surface/50 rounded-xl p-4 border border-royal-border mb-2">
            <p className="font-body text-xs text-royal-navy/60">
              Full URLs for your social profiles. These appear in the website footer. Leave blank to hide an icon.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Instagram</label>
              <input className={inputCls} type="url" value={form.instagram_url || ''} onChange={e => set('instagram_url', e.target.value)} placeholder="https://instagram.com/durvawoodcraft" />
            </div>
            <div>
              <label className={labelCls}>Facebook</label>
              <input className={inputCls} type="url" value={form.facebook_url || ''} onChange={e => set('facebook_url', e.target.value)} placeholder="https://facebook.com/durvawoodcraft" />
            </div>
            <div>
              <label className={labelCls}>YouTube</label>
              <input className={inputCls} type="url" value={form.youtube_url || ''} onChange={e => set('youtube_url', e.target.value)} placeholder="https://youtube.com/@durvawoodcraft" />
            </div>
          </div>
        </Section>

        {/* ── Theme Colors ──────────────────────────────────────── */}
        <Section icon={Globe} title="Theme Colors">
          <p className="font-body text-xs text-royal-navy/50">
            Royal Craft theme colors are fixed in code. Color pickers below update CSS variables for accent overrides only.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: 'primary_color',   label: 'Primary',   default: '#8B4513' },
              { key: 'secondary_color', label: 'Secondary', default: '#D2691E' },
              { key: 'accent_color',    label: 'Accent',    default: '#C9973A' },
            ].map(({ key, label, default: def }) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                <input type="color"
                  value={(form as any)[key] || def}
                  onChange={e => set(key as keyof Settings, e.target.value)}
                  className="w-full h-11 rounded-xl border border-royal-border cursor-pointer"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* ── Save button ───────────────────────────────────────── */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-royal-brown text-royal-bg font-body font-semibold text-sm hover:bg-royal-chocolate transition-all shadow-royal-sm hover:shadow-royal-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-royal-bg/30 border-t-royal-bg rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
