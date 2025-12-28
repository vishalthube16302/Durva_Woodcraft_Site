import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase, Category } from '../../lib/supabase';
import { useSettings } from '../../hooks/useSettings';

export default function CategoriesPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', display_order: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = async () => {
    if (!formData.name) return;
    try {
      const { error } = await supabase.from('categories').insert([formData]);
      if (error) throw error;
      setFormData({ name: '', description: '', display_order: 0 });
      setIsAdding(false);
      fetchCategories();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(formData)
        .eq('id', id);
      if (error) throw error;
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      fetchCategories();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!settings) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: settings.primary_color }}>
          Categories
        </h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 px-6 py-3 rounded-lg text-white"
            style={{ backgroundColor: settings.primary_color }}
          >
            <Plus size={18} />
            <span>Add</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-6 p-6 border-2 rounded-lg" style={{ borderColor: settings.primary_color }}>
          <div className="grid gap-4">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Category Name"
              className="px-4 py-3 rounded-lg border"
            />
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description"
              className="px-4 py-3 rounded-lg border"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleAdd}
                className="px-6 py-3 rounded-lg text-white"
                style={{ backgroundColor: settings.primary_color }}
              >
                Save
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 rounded-lg bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.id} className="border rounded-lg p-6 flex justify-between">
              <div>
                <h3 className="text-xl font-bold" style={{ color: settings.primary_color }}>
                  {cat.name}
                </h3>
                <p className="text-gray-600">{cat.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingId(cat.id);
                    setFormData(cat);
                  }}
                  className="p-2"
                  style={{ color: settings.primary_color }}
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
