import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase, Product, Category } from '../../lib/supabase';
import { useSettings } from '../../hooks/useSettings';
import { getImageUrl } from '../../utils/imageUtils';

export default function ProductsPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // RAW FORM Data - we store complex fields as strings for JSON editing
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: 0,
    imagesJson: '[]', // Stores JSON string of images array
    specificationsJson: '{}', // Stores JSON string of key-value pairs
    featuresJson: '[]', // Stores JSON string of features array
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
      // Parse JSON fields
      let images = [];
      let specifications = {};
      let features = [];

      try { images = JSON.parse(formData.imagesJson); } catch (e) { alert('Invalid Images JSON'); return; }
      try { specifications = JSON.parse(formData.specificationsJson); } catch (e) { alert('Invalid Specifications JSON'); return; }
      try { features = JSON.parse(formData.featuresJson); } catch (e) { alert('Invalid Features JSON'); return; }

      const { error } = await supabase.from('products').insert([{
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category_id: formData.category_id || null,
        images: images,
        specifications: specifications,
        features: features,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        display_order: formData.display_order
      }]);

      if (error) throw error;
      resetForm();
      fetchProducts();
    } catch (error) {
      alert('Error saving product: ' + (error as any).message);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      // Parse JSON fields
      let images = [];
      let specifications = {};
      let features = [];

      try { images = JSON.parse(formData.imagesJson); } catch (e) { alert('Invalid Images JSON'); return; }
      try { specifications = JSON.parse(formData.specificationsJson); } catch (e) { alert('Invalid Specifications JSON'); return; }
      try { features = JSON.parse(formData.featuresJson); } catch (e) { alert('Invalid Features JSON'); return; }

      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category_id: formData.category_id || null,
          images: images,
          specifications: specifications,
          features: features,
          is_featured: formData.is_featured,
          is_active: formData.is_active,
          display_order: formData.display_order
        })
        .eq('id', id);
      if (error) throw error;
      resetForm();
      fetchProducts();
    } catch (error) {
      alert('Error updating product: ' + (error as any).message);
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
      imagesJson: '[]',
      specificationsJson: '{}',
      featuresJson: '[]',
      is_featured: false,
      is_active: true,
      display_order: 0,
    });
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      category_id: product.category_id || '',
      price: product.price,
      imagesJson: JSON.stringify(product.images || [], null, 2),
      specificationsJson: JSON.stringify(product.specifications || {}, null, 2),
      featuresJson: JSON.stringify(product.features || [], null, 2),
      is_featured: product.is_featured,
      is_active: product.is_active,
      display_order: product.display_order,
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

            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
              />
            </div>

            {/* CATEGORY, PRICE & ORDER */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border resize-none"
              />
            </div>

            {/* SPECIFICATIONS JSON */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specifications (JSON Key-Value)
              </label>
              <textarea
                value={formData.specificationsJson}
                onChange={(e) => setFormData({ ...formData, specificationsJson: e.target.value })}
                rows={4}
                placeholder='{"Weight": "10kg", "Material": "Teak"}'
                className="w-full px-4 py-2 rounded-lg border font-mono text-sm bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Enter valid JSON object.</p>
            </div>

            {/* IMAGES JSON */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images (JSON Array)
              </label>
              <textarea
                value={formData.imagesJson}
                onChange={(e) => setFormData({ ...formData, imagesJson: e.target.value })}
                rows={4}
                placeholder='["image1.jpg", "image2.jpg"]'
                className="w-full px-4 py-2 rounded-lg border font-mono text-sm bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                First image is Main. Others appear in details. Use filenames from <code>public/images/</code>.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex space-x-2 pt-4">
              <button
                onClick={editingId ? () => handleUpdate(editingId) : handleAdd}
                className="px-6 py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: settings.primary_color }}
              >
                Save Product
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-2 rounded-lg bg-gray-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT LIST */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden flex flex-col">
              <div className="h-48 overflow-hidden bg-gray-100 relative">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={getImageUrl(product.images[0])}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold" style={{ color: settings.primary_color }}>
                    {product.name}
                  </h3>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {categories.find(c => c.id === product.category_id)?.name || 'Uncategorized'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="mt-auto flex justify-between items-center">
                  <p className="font-bold text-lg">₹{product.price.toLocaleString()}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(product)}
                      className="p-2 rounded hover:bg-gray-100 text-blue-600"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 rounded hover:bg-gray-100 text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={18} />
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
