import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Save, X, CheckCircle, AlertCircle, FolderOpen } from 'lucide-react';
import { supabase, Category } from '../../lib/supabase';
import { useSettings } from '../../hooks/useSettings';

type Toast = { type: 'success' | 'error'; text: string } | null;

export default function CategoriesPanel() {
  const [categories, setCategories]   = useState<Category[]>([]);
  const [loading, setLoading]         = useState(true);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [editForm, setEditForm]       = useState({ name: '', description: '', display_order: 0 });
  const [addForm, setAddForm]         = useState({ name: '', description: '', display_order: 0 });
  const [isAdding, setIsAdding]       = useState(false);
  const [toast, setToast]             = useState<Toast>(null);
  const { settings } = useSettings();

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleAdd = async () => {
    if (!addForm.name.trim()) return;
    try {
      const { error } = await supabase.from('categories').insert([{
        name: addForm.name.trim(),
        description: addForm.description.trim(),
        display_order: addForm.display_order,
      }]);
      if (error) throw error;
      setAddForm({ name: '', description: '', display_order: 0 });
      setIsAdding(false);
      showToast('success', `Category "${addForm.name}" added!`);
      fetchCategories();
    } catch (err: any) {
      showToast('error', 'Failed to add category: ' + err.message);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, description: cat.description || '', display_order: cat.display_order });
  };

  const cancelEdit = () => { setEditingId(null); };

  const handleUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: editForm.name.trim(),
          description: editForm.description.trim(),
          display_order: editForm.display_order,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error) throw error;
      setEditingId(null);
      showToast('success', 'Category updated!');
      fetchCategories();
    } catch (err: any) {
      showToast('error', 'Failed to update: ' + err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Products in this category will become uncategorised.`)) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      showToast('success', `Category "${name}" deleted.`);
      fetchCategories();
    } catch (err: any) {
      showToast('error', 'Failed to delete: ' + err.message);
    }
  };

  if (!settings) return null;

  const inputCls = 'w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-royal-mahogany">Categories</h2>
          <p className="font-body text-sm text-royal-navy/50 mt-1">{categories.length} categories</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => { setIsAdding(true); setEditingId(null); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-body font-semibold text-sm shadow-sm hover:opacity-90 transition-all"
            style={{ backgroundColor: settings.primary_color }}
          >
            <Plus size={16} /> Add Category
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

      {/* Add form */}
      {isAdding && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-display font-bold text-royal-mahogany">New Category</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Name *</label>
              <input className={inputCls} type="text"
                placeholder="e.g. Dining Tables"
                value={addForm.name}
                onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                autoFocus />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Display Order</label>
              <input className={inputCls} type="number"
                value={addForm.display_order}
                onChange={e => setAddForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description</label>
            <input className={inputCls} type="text"
              placeholder="Short description shown to customers"
              value={addForm.description}
              onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-body font-semibold text-sm"
              style={{ backgroundColor: settings.primary_color }}>
              <Save size={15} /> Save Category
            </button>
            <button onClick={() => setIsAdding(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-body text-sm">
              <X size={15} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 font-body">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center text-gray-400">
          <FolderOpen size={40} className="mb-3 opacity-30" />
          <p className="font-body text-sm">No categories yet. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {editingId === cat.id ? (
                /* ── Inline Edit Form ── */
                <div className="p-5 bg-amber-50 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Name *</label>
                      <input className={inputCls} type="text"
                        value={editForm.name}
                        onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                        autoFocus />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Display Order</label>
                      <input className={inputCls} type="number"
                        value={editForm.display_order}
                        onChange={e => setEditForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description</label>
                    <input className={inputCls} type="text"
                      value={editForm.description}
                      onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleUpdate(cat.id)}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl text-white font-body font-semibold text-sm"
                      style={{ backgroundColor: settings.primary_color }}>
                      <Save size={14} /> Update
                    </button>
                    <button onClick={cancelEdit}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl border border-gray-300 text-gray-600 font-body text-sm">
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Display Row ── */
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: settings.primary_color }}>
                      {cat.display_order}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-royal-mahogany">{cat.name}</h3>
                      {cat.description && (
                        <p className="font-body text-sm text-gray-500 mt-0.5">{cat.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(cat)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
