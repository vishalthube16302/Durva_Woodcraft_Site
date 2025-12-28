import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useSettings } from '../hooks/useSettings';
import { ShoppingCart } from 'lucide-react';

export default function Products() {
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const { settings } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  if (loading || !settings) return null;

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: settings.primary_color }}>
            Our Premium Collection
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              selectedCategory === null ? 'text-white shadow-lg' : 'bg-white text-gray-700'
            }`}
            style={selectedCategory === null ? { backgroundColor: settings.primary_color } : {}}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === cat.id ? 'text-white shadow-lg' : 'bg-white text-gray-700'
              }`}
              style={selectedCategory === cat.id ? { backgroundColor: settings.primary_color } : {}}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No products available.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                <div className="h-80 overflow-hidden">
                  <img
                    src={product.images[0] || 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg'}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: settings.primary_color }}>
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold" style={{ color: settings.primary_color }}>
                      ₹{product.price}
                    </p>
                    <button
                      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                      className="p-3 rounded-full text-white transition-all"
                      style={{ backgroundColor: settings.primary_color }}
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
