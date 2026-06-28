import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Edit2, Trash2, Save, X, CheckCircle, AlertCircle,
  Upload, Copy, Trash, Image as ImageIcon, Star, Eye, EyeOff, Package
} from 'lucide-react';
import { supabase, Product, Category } from '../../lib/supabase';
import { useSettings } from '../../hooks/useSettings';
import { getImageUrl } from '../../utils/imageUtils';

type Toast = { type: 'success' | 'error'; text: string } | null;
type EditorTab = 'basic' | 'images' | 'features' | 'specs';

interface SpecEntry { key: string; val: string; }
interface StorageFile { name: string; url: string; }

const EMPTY_FORM = {
  name: '',
  description: '',
  category_id: '',
  price: 0,
  display_order: 0,
  is_featured: false,
  is_active: true,
  wood_type: '',
  finish_type: '',
  delivery_days: '7-21 working days',
  is_custom_available: true,
  images: [] as string[],
  features: [] as string[],
  specs: [] as SpecEntry[],
};

export default function ProductsPanel() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [isAdding, setIsAdding]     = useState(false);
  const [editorTab, setEditorTab]   = useState<EditorTab>('basic');
  const [form, setForm]             = useState({ ...EMPTY_FORM });
  const [toast, setToast]           = useState<Toast>(null);
  const [newFeature, setNewFeature] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');
  const [uploading, setUploading]   = useState(false);
  const [storageFiles, setStorageFiles] = useState<StorageFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const editCardRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();

  const showToast = useCallback((type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products').select('*').order('display_order', { ascending: true });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').order('display_order');
    setCategories(data || []);
  }, []);

  const fetchStorageFiles = useCallback(async () => {
    setLoadingFiles(true);
    try {
      const { data } = await supabase.storage.from('product-images').list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });
      if (data) {
        const files: StorageFile[] = data
          .filter(f => f.name !== '.emptyFolderPlaceholder')
          .map(f => ({
            name: f.name,
            url: supabase.storage.from('product-images').getPublicUrl(f.name).data.publicUrl,
          }));
        setStorageFiles(files);
      }
    } catch (err) { console.error(err); }
    finally { setLoadingFiles(false); }
  }, []);

  useEffect(() => { fetchProducts(); fetchCategories(); }, [fetchProducts, fetchCategories]);

  const productToForm = (p: Product) => {
    // Convert specs object to ordered array preserving key order
    const specs: SpecEntry[] = Object.entries(p.specifications || {}).map(([key, val]) => ({ key, val: String(val) }));
    return {
      name: p.name,
      description: p.description || '',
      category_id: p.category_id || '',
      price: p.price,
      display_order: p.display_order,
      is_featured: p.is_featured,
      is_active: p.is_active,
      wood_type: p.wood_type || '',
      finish_type: p.finish_type || '',
      delivery_days: p.delivery_days || '7-21 working days',
      is_custom_available: p.is_custom_available ?? true,
      images: [...(p.images || [])],
      features: [...(p.features || [])],
      specs,
    };
  };

  const formToPayload = () => {
    // Convert spec array back to object (preserving order via insertion order)
    const specifications: Record<string, string> = {};
    form.specs.forEach(({ key, val }) => { if (key.trim()) specifications[key.trim()] = val; });
    return {
      name: form.name,
      description: form.description,
      category_id: form.category_id || null,
      price: form.price,
      display_order: form.display_order,
      is_featured: form.is_featured,
      is_active: form.is_active,
      wood_type: form.wood_type,
      finish_type: form.finish_type,
      delivery_days: form.delivery_days,
      is_custom_available: form.is_custom_available,
      images: form.images,
      features: form.features,
      specifications,
    };
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setIsAdding(false);
    setForm(productToForm(product));
    setEditorTab('basic');
    // Scroll to edit panel after render
    setTimeout(() => editCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setForm({ ...EMPTY_FORM, images: [], features: [], specs: [] });
    setEditorTab('basic');
    setTimeout(() => editCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const resetForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setForm({ ...EMPTY_FORM, images: [], features: [], specs: [] });
    setNewFeature('');
    setNewSpecKey('');
    setNewSpecVal('');
  };

  const handleSave = async () => {
    if (!form.name.trim()) { showToast('error', 'Product name is required.'); return; }
    const payload = formToPayload();
    try {
      if (editingId) {
        const { error } = await supabase.from('products').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editingId);
        if (error) throw error;
        showToast('success', `"${form.name}" updated successfully!`);
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
        showToast('success', `"${form.name}" added successfully!`);
        setIsAdding(false);
        setEditingId(null);
      }
      await fetchProducts();
      // Keep edit form open so user stays on the product (for editing flow)
      if (!editingId) resetForm();
    } catch (err: any) {
      showToast('error', 'Save failed: ' + err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { showToast('error', 'Delete failed: ' + error.message); return; }
    showToast('success', `"${name}" deleted.`);
    if (editingId === id) resetForm();
    fetchProducts();
  };

  // ── Feature helpers ──
  const addFeature = () => {
    const f = newFeature.trim();
    if (!f) return;
    setForm(prev => ({ ...prev, features: [...prev.features, f] }));
    setNewFeature('');
  };
  const removeFeature = (i: number) =>
    setForm(prev => ({ ...prev, features: prev.features.filter((_, idx) => idx !== i) }));

  // ── Spec helpers ──
  const addSpec = () => {
    const k = newSpecKey.trim();
    if (!k) return;
    setForm(prev => ({ ...prev, specs: [...prev.specs, { key: k, val: newSpecVal.trim() }] }));
    setNewSpecKey(''); setNewSpecVal('');
  };
  const updateSpec = (i: number, field: 'key' | 'val', value: string) =>
    setForm(prev => {
      const specs = [...prev.specs];
      specs[i] = { ...specs[i], [field]: value };
      return { ...prev, specs };
    });
  const removeSpec = (i: number) =>
    setForm(prev => ({ ...prev, specs: prev.specs.filter((_, idx) => idx !== i) }));

  // ── Image helpers ──
  const addImageUrl = (url: string) => {
    if (!url.trim() || form.images.includes(url.trim())) return;
    setForm(prev => ({ ...prev, images: [...prev.images, url.trim()] }));
  };
  const removeImage = (i: number) =>
    setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));
  const moveImage = (i: number, dir: -1 | 1) => {
    const imgs = [...form.images];
    const j = i + dir;
    if (j < 0 || j >= imgs.length) return;
    [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
    setForm(prev => ({ ...prev, images: imgs }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop();
      const fileName = `product_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}.${ext}`;
      const { error } = await supabase.storage.from('product-images').upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      addImageUrl(data.publicUrl);
      await fetchStorageFiles();
      showToast('success', 'Image uploaded!');
    } catch (err: any) {
      showToast('error', 'Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteFile = async (name: string) => {
    if (!confirm(`Delete file "${name}" from storage? This will break any product using it.`)) return;
    const { error } = await supabase.storage.from('product-images').remove([name]);
    if (error) { showToast('error', 'Delete failed: ' + error.message); return; }
    showToast('success', 'File deleted from storage.');
    fetchStorageFiles();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => showToast('success', 'URL copied to clipboard!'));
  };

  if (!settings) return null;

  const inputCls = 'w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all';
  const labelCls = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5';

  const TABS: { id: EditorTab; label: string }[] = [
    { id: 'basic',    label: 'Basic Info' },
    { id: 'images',   label: `Images (${form.images.length})` },
    { id: 'features', label: `Features (${form.features.length})` },
    { id: 'specs',    label: `Specs (${form.specs.length})` },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-royal-mahogany">Products</h2>
          <p className="font-body text-sm text-royal-navy/50 mt-1">{products.length} products</p>
        </div>
        {!isAdding && !editingId && (
          <button onClick={startAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-body font-semibold text-sm shadow-sm hover:opacity-90 transition-all"
            style={{ backgroundColor: settings.primary_color }}>
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-body ${
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
            : <AlertCircle size={16} className="text-red-500 flex-shrink-0" />}
          {toast.text}
        </div>
      )}

      {/* ── EDITOR ── */}
      {(isAdding || editingId) && (
        <div ref={editCardRef} className="bg-white rounded-2xl border-2 border-amber-800/30 shadow-lg overflow-hidden">

          {/* Editor header */}
          <div className="flex items-center justify-between px-6 py-4 bg-amber-50 border-b border-amber-200">
            <h3 className="font-display font-bold text-royal-mahogany">
              {editingId ? `Editing: ${form.name || 'Product'}` : 'New Product'}
            </h3>
            <button onClick={resetForm} className="p-2 rounded-lg hover:bg-amber-100 text-gray-500 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 px-6 pt-4 border-b border-gray-100 bg-white">
            {TABS.map(t => (
              <button key={t.id} onClick={() => { setEditorTab(t.id); if (t.id === 'images') fetchStorageFiles(); }}
                className={`px-4 py-2.5 text-sm font-body font-semibold rounded-t-lg border-b-2 transition-all ${
                  editorTab === t.id
                    ? 'border-amber-800 text-amber-900 bg-amber-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ── TAB: Basic Info ── */}
            {editorTab === 'basic' && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Product Name *</label>
                    <input className={inputCls} type="text" autoFocus
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Sheesham Dining Table – 6 Seater" />
                  </div>
                  <div>
                    <label className={labelCls}>Category</label>
                    <select className={inputCls}
                      value={form.category_id}
                      onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
                      <option value="">— No Category —</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Description</label>
                  <textarea className={inputCls + ' resize-none'} rows={3}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Short description shown on product card and details page" />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Price (₹)</label>
                    <input className={inputCls} type="number" min="0"
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Wood Type</label>
                    <input className={inputCls} type="text"
                      value={form.wood_type}
                      onChange={e => setForm(f => ({ ...f, wood_type: e.target.value }))}
                      placeholder="e.g. Sheesham, Teak, Mango" />
                  </div>
                  <div>
                    <label className={labelCls}>Finish Type</label>
                    <input className={inputCls} type="text"
                      value={form.finish_type}
                      onChange={e => setForm(f => ({ ...f, finish_type: e.target.value }))}
                      placeholder="e.g. Matte, Glossy, Natural" />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Delivery Days</label>
                    <input className={inputCls} type="text"
                      value={form.delivery_days}
                      onChange={e => setForm(f => ({ ...f, delivery_days: e.target.value }))}
                      placeholder="7-21 working days" />
                  </div>
                  <div>
                    <label className={labelCls}>Display Order</label>
                    <input className={inputCls} type="number"
                      value={form.display_order}
                      onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
                  </div>
                  <div className="flex flex-col justify-end gap-3 pb-0.5">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={form.is_featured}
                        onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                        className="w-4 h-4 rounded accent-amber-800" />
                      Featured product
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={form.is_active}
                        onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                        className="w-4 h-4 rounded accent-amber-800" />
                      Active (visible on site)
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={form.is_custom_available}
                        onChange={e => setForm(f => ({ ...f, is_custom_available: e.target.checked }))}
                        className="w-4 h-4 rounded accent-amber-800" />
                      Custom size available
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Images ── */}
            {editorTab === 'images' && (
              <div className="space-y-6">
                {/* Current images */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">
                    Product Images <span className="text-gray-400 font-normal">(first = main/cover)</span>
                  </h4>
                  {form.images.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
                      <ImageIcon size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No images yet. Upload below or paste URLs.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {form.images.map((url, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                          <img src={getImageUrl(url)} alt={`img-${i}`} className="w-full h-full object-cover" />
                          {i === 0 && (
                            <span className="absolute top-1.5 left-1.5 bg-amber-600 text-white text-xs px-1.5 py-0.5 rounded-md font-semibold">
                              Cover
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {i > 0 && (
                              <button onClick={() => moveImage(i, -1)}
                                className="bg-white/90 text-gray-700 rounded-lg p-1.5 text-xs font-bold hover:bg-white">
                                ↑
                              </button>
                            )}
                            {i < form.images.length - 1 && (
                              <button onClick={() => moveImage(i, 1)}
                                className="bg-white/90 text-gray-700 rounded-lg p-1.5 text-xs font-bold hover:bg-white">
                                ↓
                              </button>
                            )}
                            <button onClick={() => copyToClipboard(url)}
                              className="bg-white/90 text-blue-600 rounded-lg p-1.5 hover:bg-white" title="Copy URL">
                              <Copy size={13} />
                            </button>
                            <button onClick={() => removeImage(i)}
                              className="bg-white/90 text-red-500 rounded-lg p-1.5 hover:bg-white" title="Remove">
                              <X size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upload new */}
                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <h4 className="font-semibold text-sm text-gray-700">Upload New Image</h4>
                  <div className="relative inline-block">
                    <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <button disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                      <Upload size={15} />
                      {uploading ? 'Uploading...' : 'Choose & Upload Image'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">After uploading, the image is automatically added to this product.</p>
                </div>

                {/* Storage browser */}
                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-gray-700">Storage Browser</h4>
                    <button onClick={fetchStorageFiles}
                      className="text-xs text-gray-500 hover:text-gray-700 underline">
                      {loadingFiles ? 'Loading...' : 'Refresh'}
                    </button>
                  </div>
                  {storageFiles.length === 0 ? (
                    <p className="text-sm text-gray-400">No files in storage yet.</p>
                  ) : (
                    <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                      {storageFiles.map(f => (
                        <div key={f.name} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 group">
                          <img src={f.url} alt={f.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-gray-200" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 truncate font-medium">{f.name}</p>
                            <p className="text-xs text-gray-400 truncate">{f.url}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => addImageUrl(f.url)} title="Add to product"
                              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100">
                              <Plus size={12} />
                            </button>
                            <button onClick={() => copyToClipboard(f.url)} title="Copy URL"
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                              <Copy size={12} />
                            </button>
                            <button onClick={() => handleDeleteFile(f.name)} title="Delete from storage"
                              className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100">
                              <Trash size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB: Features ── */}
            {editorTab === 'features' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Key features shown as bullet points on the product detail page.</p>
                <div className="space-y-2">
                  {form.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 group">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 font-bold"
                        style={{ backgroundColor: settings.primary_color }}>
                        ✓
                      </span>
                      <input
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-amber-800 transition-all"
                        value={feat}
                        onChange={e => {
                          const feats = [...form.features];
                          feats[i] = e.target.value;
                          setForm(f => ({ ...f, features: feats }));
                        }} />
                      <button onClick={() => removeFeature(i)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input className={inputCls + ' flex-1'} type="text"
                    value={newFeature}
                    onChange={e => setNewFeature(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    placeholder="e.g. Solid sheesham wood construction" />
                  <button onClick={addFeature}
                    className="px-4 py-2.5 rounded-lg text-white text-sm font-semibold flex-shrink-0"
                    style={{ backgroundColor: settings.primary_color }}>
                    + Add
                  </button>
                </div>
                <p className="text-xs text-gray-400">Press Enter or click Add to add each feature.</p>
              </div>
            )}

            {/* ── TAB: Specifications ── */}
            {editorTab === 'specs' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Specifications shown in the details table. Order is preserved.</p>
                <div className="space-y-2">
                  {form.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 group">
                      <input
                        className="w-2/5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium focus:outline-none focus:border-amber-800 transition-all"
                        value={spec.key}
                        onChange={e => updateSpec(i, 'key', e.target.value)}
                        placeholder="e.g. Weight" />
                      <span className="text-gray-400 flex-shrink-0">:</span>
                      <input
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-amber-800 transition-all"
                        value={spec.val}
                        onChange={e => updateSpec(i, 'val', e.target.value)}
                        placeholder="e.g. 45 kg" />
                      <button onClick={() => removeSpec(i)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input className="w-2/5 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-amber-800"
                    value={newSpecKey}
                    onChange={e => setNewSpecKey(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpec())}
                    placeholder="Spec name" />
                  <input className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-amber-800"
                    value={newSpecVal}
                    onChange={e => setNewSpecVal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpec())}
                    placeholder="Value" />
                  <button onClick={addSpec}
                    className="px-4 py-2.5 rounded-lg text-white text-sm font-semibold flex-shrink-0"
                    style={{ backgroundColor: settings.primary_color }}>
                    + Add
                  </button>
                </div>
              </div>
            )}

            {/* Save / Cancel */}
            <div className="flex gap-3 pt-6 border-t border-gray-100 mt-6">
              <button onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-body font-semibold text-sm shadow-sm hover:opacity-90 transition-all"
                style={{ backgroundColor: settings.primary_color }}>
                <Save size={15} /> {editingId ? 'Update Product' : 'Save Product'}
              </button>
              <button onClick={resetForm}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-body text-sm hover:bg-gray-50">
                <X size={15} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCT GRID (3 columns) ── */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 font-body">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center text-gray-400">
          <Package size={40} className="mb-3 opacity-30" />
          <p className="font-body text-sm">No products yet. Add your first product above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id}
              className={`rounded-2xl border overflow-hidden flex flex-col transition-all ${
                editingId === product.id
                  ? 'border-amber-800 ring-2 ring-amber-800/20'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}>
              {/* Thumbnail */}
              <div className="h-40 bg-gray-100 relative flex-shrink-0">
                {product.images?.[0] ? (
                  <img src={getImageUrl(product.images[0])} alt={product.name}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <ImageIcon size={28} />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  {product.is_featured && (
                    <span className="flex items-center gap-0.5 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                      <Star size={9} fill="currentColor" /> Featured
                    </span>
                  )}
                  {!product.is_active && (
                    <span className="flex items-center gap-0.5 bg-gray-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                      <EyeOff size={9} /> Hidden
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="mb-1">
                  <p className="text-xs text-gray-400 font-body">
                    {categories.find(c => c.id === product.category_id)?.name || 'Uncategorised'}
                  </p>
                  <h3 className="font-display font-bold text-royal-mahogany text-sm leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <p className="font-bold text-royal-mahogany">₹{product.price.toLocaleString()}</p>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(product)}
                      className={`p-2 rounded-lg transition-colors text-sm ${
                        editingId === product.id
                          ? 'bg-amber-100 text-amber-800'
                          : 'hover:bg-blue-50 text-blue-600'
                      }`} title="Edit">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(product.id, product.name)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
