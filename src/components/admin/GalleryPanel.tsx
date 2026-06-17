import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, ImageIcon, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSettings } from '../../hooks/useSettings';
import { getImageUrl } from '../../utils/imageUtils';

interface GalleryRow {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category_tag: string | null;
  location_delivered: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

const TAG_OPTIONS = ['Dining', 'Living Room', 'Bedroom', 'Office & Study', 'Decor & Gifts', 'Custom Work'];

export default function GalleryPanel() {
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { settings } = useSettings();

  const emptyForm = {
    title: '',
    description: '',
    image_url: '',
    category_tag: TAG_OPTIONS[0],
    location_delivered: '',
    is_featured: false,
    is_active: true,
    display_order: 0,
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) console.error(error);
    setItems(data || []);
    setLoading(false);
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `gallery_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;

      const { error } = await supabase.storage.from('product-images').upload(fileName, file);
      if (error) throw error;

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setFormData((f) => ({ ...f, image_url: data.publicUrl }));
    } catch (err) {
      alert('Upload failed: ' + (err as any).message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!formData.title || !formData.image_url) {
      alert('Please add a title and upload a photo first.');
      return;
    }
    const { error } = await supabase.from('gallery').insert([formData]);
    if (error) {
      alert('Error saving: ' + error.message);
      return;
    }
    resetForm();
    fetchItems();
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase.from('gallery').update(formData).eq('id', id);
    if (error) {
      alert('Error updating: ' + error.message);
      return;
    }
    resetForm();
    fetchItems();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}" from the gallery?`)) return;
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) {
      alert('Error deleting: ' + error.message);
      return;
    }
    fetchItems();
  };

  const startEdit = (item: GalleryRow) => {
    setFormData({
      title: item.title,
      description: item.description || '',
      image_url: item.image_url,
      category_tag: item.category_tag || TAG_OPTIONS[0],
      location_delivered: item.location_delivered || '',
      is_featured: item.is_featured,
      is_active: item.is_active,
      display_order: item.display_order,
    });
    setEditingId(item.id);
    setIsAdding(false);
  };

  if (!settings) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: settings.primary_color }}>
            Real Site Photos
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload actual photos of your work — these appear on the public /gallery page customers and officers see.
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-lg text-white font-medium"
            style={{ backgroundColor: settings.primary_color }}
          >
            <Plus size={18} /> Add Photo
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold mb-4 text-gray-700">
            {editingId ? 'Edit Photo' : 'Add New Photo'}
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">Photo</label>
            {formData.image_url ? (
              <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-200 mb-2">
                <img src={formData.image_url} alt="preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-48 h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-2 text-gray-300">
                <ImageIcon size={32} />
              </div>
            )}
            <div className="relative inline-block">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 disabled:opacity-50"
              >
                <Upload size={15} /> {uploading ? 'Uploading...' : formData.image_url ? 'Replace Photo' : 'Upload Photo'}
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Title *</label>
              <input
                type="text"
                placeholder="e.g. Sheesham Dining Set — 6 Seater"
                value={formData.title}
                onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Category Tag</label>
              <select
                value={formData.category_tag}
                onChange={(e) => setFormData((f) => ({ ...f, category_tag: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Delivered To (city)</label>
              <input
                type="text"
                placeholder="e.g. Pune, Maharashtra"
                value={formData.location_delivered}
                onChange={(e) => setFormData((f) => ({ ...f, location_delivered: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData((f) => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Short Description</label>
            <textarea
              rows={2}
              placeholder="e.g. Solid sheesham wood, hand-carved legs, natural matte finish."
              value={formData.description}
              onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex gap-6 mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData((f) => ({ ...f, is_featured: e.target.checked }))}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData((f) => ({ ...f, is_active: e.target.checked }))}
              />
              Visible on site
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => (editingId ? handleUpdate(editingId) : handleAdd())}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium"
              style={{ backgroundColor: settings.primary_color }}
            >
              <Save size={16} /> {editingId ? 'Update' : 'Save'}
            </button>
            <button
              onClick={resetForm}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading gallery...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 flex flex-col items-center text-gray-400">
          <ImageIcon size={48} className="mb-4 opacity-20" />
          <p>No photos yet. Add your first real product photo above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden group relative">
              <div className="relative h-44 bg-gray-100">
                <img
                  src={getImageUrl(item.image_url)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {item.is_featured && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                    <Star size={10} fill="currentColor" /> Featured
                  </span>
                )}
                {!item.is_active && (
                  <span className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full">
                    Hidden
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm text-gray-800 truncate">{item.title}</p>
                <p className="text-xs text-gray-400">
                  {item.category_tag}
                  {item.location_delivered && ` · ${item.location_delivered}`}
                </p>
              </div>
              <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(item)}
                  className="p-2 rounded-lg bg-white shadow-md text-blue-600"
                  title="Edit"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-2 rounded-lg bg-white shadow-md text-red-600"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
