import { useState, useEffect, useCallback } from 'react';
import { Save, CheckCircle, AlertCircle, Award, Globe, Phone, Link, Palette, BarChart2 } from 'lucide-react';
import { supabase, Settings } from '../../lib/supabase';
import { useSettings } from '../../hooks/useSettings';

export default function SettingsPanel() {
  const { settings: current, refetch } = useSettings();
  const [form, setForm]     = useState<Partial<Settings> | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Only load form ONCE on mount (or if settings weren't loaded yet)
  useEffect(() => {
    if (current && form === null) {
      setForm(JSON.parse(JSON.stringify(current))); // deep clone to avoid reference sharing
    }
  }, [current, form]);

  const set = useCallback((key: keyof Settings, val: any) =>
    setForm(prev => prev ? { ...prev, [key]: val } : prev), []);

  const setSocial = useCallback((platform: 'instagram' | 'facebook' | 'youtube', val: string) =>
    setForm(prev => prev ? ({
      ...prev,
      social_links: { ...(prev.social_links || {}), [platform]: val }
    }) : prev), []);

  const handlePhoneChange = useCallback((index: number, val: string) =>
    setForm(prev => {
      if (!prev) return prev;
      const phones = [...(prev.phone_numbers || [])];
      phones[index] = val;
      return { ...prev, phone_numbers: phones };
    }), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !current?.id) return;
    setSaving(true);
    setMsg(null);
    try {
      const { error } = await supabase
        .from('settings')
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq('id', current.id);
      if (error) throw error;
      setMsg({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMsg(null), 4000);
      refetch();
    } catch {
      setMsg({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (!form) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-royal-brown border-t-transparent rounded-full animate-spin" />
    </div>
  );

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
        <p className="font-body text-sm text-royal-navy/50 mt-1">All fields update the live website after saving.</p>
      </div>

      {msg && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border font-body text-sm ${
          msg.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {msg.type === 'success'
            ? <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
            : <AlertCircle size={18} className="text-red-500 flex-shrink-0" />}
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Brand */}
        <Section icon={Globe} title="Brand Identity">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Brand Name</label>
              <input className={inputCls} type="text"
                value={form.brand_name || ''}
                onChange={e => set('brand_name', e.target.value)}
                placeholder="Durva Woodcraft" />
            </div>
            <div>
              <label className={labelCls}>Tagline</label>
              <input className={inputCls} type="text"
                value={form.tagline || ''}
                onChange={e => set('tagline', e.target.value)}
                placeholder="Honoring Nature, Crafting Life" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Logo (filename in public/images/ or full URL)</label>
            <input className={inputCls} type="text"
              value={form.logo_url || ''}
              onChange={e => set('logo_url', e.target.value)}
              placeholder="logo.png" />
          </div>
        </Section>

        {/* Contact */}
        <Section icon={Phone} title="Contact Details">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Primary Phone (for calls)</label>
              <input className={inputCls} type="tel"
                value={form.phone_numbers?.[0] || ''}
                onChange={e => handlePhoneChange(0, e.target.value)}
                placeholder="9823022365" />
            </div>
            <div>
              <label className={labelCls}>WhatsApp Number</label>
              <input className={inputCls} type="tel"
                value={form.whatsapp_number || ''}
                onChange={e => set('whatsapp_number', e.target.value)}
                placeholder="919823022365" />
              <p className="font-body text-xs text-royal-navy/40 mt-1">With country code, no + (e.g. 919823022365)</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Email Address</label>
              <input className={inputCls} type="email"
                value={form.email || ''}
                onChange={e => set('email', e.target.value)}
                placeholder="contact@durvawoodcraft.in" />
            </div>
            <div>
              <label className={labelCls}>Website URL</label>
              <input className={inputCls} type="url"
                value={form.website || ''}
                onChange={e => set('website', e.target.value)}
                placeholder="https://durvawoodcraft.in" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Full Address</label>
            <textarea className={inputCls + ' resize-none'} rows={2}
              value={form.address || ''}
              onChange={e => set('address', e.target.value)}
              placeholder="Workshop address, Nashik, Maharashtra 422001" />
          </div>
        </Section>

        {/* Stats */}
        <Section icon={BarChart2} title="Business Stats (shown on homepage)">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Established Year</label>
              <input className={inputCls} type="number"
                value={form.established_year || ''}
                onChange={e => set('established_year', parseInt(e.target.value) || 2000)}
                placeholder="2000" />
            </div>
            <div>
              <label className={labelCls}>Total Customers</label>
              <input className={inputCls} type="number"
                value={form.total_customers || ''}
                onChange={e => set('total_customers', parseInt(e.target.value) || 0)}
                placeholder="1000" />
            </div>
            <div>
              <label className={labelCls}>Years Experience</label>
              <input className={inputCls} type="number"
                value={form.years_experience || ''}
                onChange={e => set('years_experience', parseInt(e.target.value) || 0)}
                placeholder="25" />
            </div>
          </div>
        </Section>

        {/* Government Credentials */}
        <Section icon={Award} title="Government & Business Credentials">
          <div className="bg-royal-surface/50 rounded-xl p-4 border border-royal-border">
            <p className="font-body text-xs text-royal-navy/60 leading-relaxed">
              These appear on the Footer, About section, and Bulk Orders page. Keep them accurate — government officers verify these numbers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>MSME / Udyam Number</label>
              <input className={inputCls} type="text"
                value={form.msme_number || ''}
                onChange={e => set('msme_number', e.target.value)}
                placeholder="MH-01-0084519" />
            </div>
            <div>
              <label className={labelCls}>GST Number (GSTIN)</label>
              <input className={inputCls} type="text"
                value={form.gst_number || ''}
                onChange={e => set('gst_number', e.target.value)}
                placeholder="27XXXXXXXXXXXXX" />
            </div>
            <div>
              <label className={labelCls}>GeM Seller ID</label>
              <input className={inputCls} type="text"
                value={form.gem_seller_id || ''}
                onChange={e => set('gem_seller_id', e.target.value)}
                placeholder="GeM-XXXX-XXXX" />
            </div>
          </div>
        </Section>

        {/* Social Media */}
        <Section icon={Link} title="Social Media">
          <p className="font-body text-xs text-royal-navy/50">Social icons in footer only appear when a URL is filled here.</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Instagram</label>
              <input className={inputCls} type="url"
                value={form.social_links?.instagram || ''}
                onChange={e => setSocial('instagram', e.target.value)}
                placeholder="https://instagram.com/durvawoodcraft" />
            </div>
            <div>
              <label className={labelCls}>Facebook</label>
              <input className={inputCls} type="url"
                value={form.social_links?.facebook || ''}
                onChange={e => setSocial('facebook', e.target.value)}
                placeholder="https://facebook.com/durvawoodcraft" />
            </div>
            <div>
              <label className={labelCls}>YouTube</label>
              <input className={inputCls} type="url"
                value={form.social_links?.youtube || ''}
                onChange={e => setSocial('youtube', e.target.value)}
                placeholder="https://youtube.com/@durvawoodcraft" />
            </div>
          </div>
        </Section>

        {/* Save */}
        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-royal-brown text-royal-bg font-body font-semibold text-sm hover:bg-royal-chocolate transition-all shadow-royal-sm hover:shadow-royal-md disabled:opacity-50 disabled:cursor-not-allowed">
            {saving
              ? <div className="w-4 h-4 border-2 border-royal-bg/30 border-t-royal-bg rounded-full animate-spin" />
              : <Save size={16} />}
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
