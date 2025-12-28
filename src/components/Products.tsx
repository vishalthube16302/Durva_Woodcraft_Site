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
            className={`px-6 py-3 rounded-full font-medium transition-all ${selectedCategory === null ? 'text-white shadow-lg' : 'bg-white text-gray-700'
              }`}
            style={selectedCategory === null ? { backgroundColor: settings.primary_color } : {}}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${selectedCategory === cat.id ? 'text-white shadow-lg' : 'bg-white text-gray-700'
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
              <a
                href={`/product_detail/${product.id}`}
                key={product.id}
                className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-80 overflow-hidden relative">
                  <img
                    src={product.images[0] || 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-[color:var(--primary-color)] transition-colors" style={{ color: settings.primary_color }}>
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-2xl font-bold" style={{ color: settings.primary_color }}>
                      ₹{product.price.toLocaleString()}
                    </p>
                    <span
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all transform group-hover:scale-110 shadow-md"
                      style={{ backgroundColor: settings.primary_color }}
                    >
                      <ShoppingCart size={20} />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
