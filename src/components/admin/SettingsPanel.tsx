import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { supabase, Settings } from '../../lib/supabase';
import { useSettings } from '../../hooks/useSettings';

export default function SettingsPanel() {
  const { settings: currentSettings, refetch } = useSettings();
  const [formData, setFormData] = useState<Partial<Settings>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (currentSettings) {
      setFormData(currentSettings);
    }
  }, [currentSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('settings')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentSettings?.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Settings updated!' });
      refetch();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings' });
    } finally {
      setSaving(false);
    }
  };

  if (!currentSettings) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6" style={{ color: currentSettings.primary_color }}>
        Website Settings
      </h2>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            value={formData.brand_name || ''}
            onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
            placeholder="Brand Name"
            className="px-4 py-3 rounded-lg border border-gray-300"
          />
          <input
            type="text"
            value={formData.tagline || ''}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="Tagline"
            className="px-4 py-3 rounded-lg border border-gray-300"
          />
        </div>

        <input
          type="url"
          value={formData.logo_url || ''}
          onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
          placeholder="Logo URL"
          className="w-full px-4 py-3 rounded-lg border border-gray-300"
        />

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Color</label>
            <input
              type="color"
              value={formData.primary_color || '#8B4513'}
              onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
              className="w-full h-12 rounded border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Secondary Color</label>
            <input
              type="color"
              value={formData.secondary_color || '#D2691E'}
              onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
              className="w-full h-12 rounded border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Accent Color</label>
            <input
              type="color"
              value={formData.accent_color || '#F4A460'}
              onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
              className="w-full h-12 rounded border"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
            className="px-4 py-3 rounded-lg border border-gray-300"
          />
          <input
            type="url"
            value={formData.website || ''}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="Website"
            className="px-4 py-3 rounded-lg border border-gray-300"
          />
        </div>

        <textarea
          value={formData.address || ''}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Address"
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 resize-none"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-8 py-3 rounded-lg text-white font-medium disabled:opacity-50"
            style={{ backgroundColor: currentSettings.primary_color }}
          >
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
