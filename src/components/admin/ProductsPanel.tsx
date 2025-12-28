import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase, Product, Category } from '../../lib/supabase';
import { useSettings } from '../../hooks/useSettings';

export default function ProductsPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: 0,
    images: [''],
    features: [''],
    is_featured: false,
    is_active: true,
    display_order: 0,
  });
  const { settings } = useSettings();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

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
    }
  }

  const handleAdd = async () => {
    if (!formData.name) return;
    try {
      const { error } = await supabase.from('products').insert([{
        ...formData,
        category_id: formData.category_id || null,
        images: formData.images.filter((img) => img),
        features: formData.features.filter((f) => f),
      }]);
      if (error) throw error;
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          ...formData,
          category_id: formData.category_id || null,
          images: formData.images.filter((img) => img),
          features: formData.features.filter((f) => f),
        })
        .eq('id', id);
      if (error) throw error;
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      name: '',
      description: '',
      category_id: '',
      price: 0,
      images: [''],
      features: [''],
      is_featured: false,
      is_active: true,
      display_order: 0,
    });
  };

  if (!settings) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: settings.primary_color }}>
          Products
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

      {(isAdding || editingId) && (
        <div className="mb-6 p-6 border-2 rounded-lg" style={{ borderColor: settings.primary_color }}>
          <div className="space-y-4">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Product Name"
              className="w-full px-4 py-3 rounded-lg border"
            />
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border resize-none"
            />
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              placeholder="Price"
              className="w-full px-4 py-3 rounded-lg border"
            />
            <div className="flex space-x-2">
              <button
                onClick={editingId ? () => handleUpdate(editingId) : handleAdd}
                className="px-6 py-3 rounded-lg text-white"
                style={{ backgroundColor: settings.primary_color }}
              >
                Save
              </button>
              <button
                onClick={resetForm}
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
        <div className="grid md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden">
              {product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold" style={{ color: settings.primary_color }}>
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <p className="font-bold mb-4">₹{product.price}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(product.id);
                      setFormData({
                        name: product.name,
                        description: product.description,
                        category_id: product.category_id || '',
                        price: product.price,
                        images: product.images.length > 0 ? product.images : [''],
                        features: product.features.length > 0 ? product.features : [''],
                        is_featured: product.is_featured,
                        is_active: product.is_active,
                        display_order: product.display_order,
                      });
                    }}
                    className="p-2"
                    style={{ color: settings.primary_color }}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
