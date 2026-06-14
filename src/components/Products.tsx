import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useSettings } from '../hooks/useSettings';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';

export default function Products() {
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const { settings } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  const waNumber = settings?.phone_numbers?.[0]?.replace(/\D/g, '') || '';

  if (loading || !settings) return null;

  return (
    <section id="products" className="py-20 bg-royal-surface/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <div className="text-center mb-14">
          <p className="font-body text-royal-brown font-semibold text-sm uppercase tracking-widest mb-3">
            Our Collection
          </p>
          <h2 className="section-heading font-display text-4xl font-bold text-royal-mahogany mb-6">
            Premium Handcrafted Furniture
          </h2>
          <hr className="royal-divider w-24 mt-10 mb-4" />
          <p className="font-body text-royal-navy/70 max-w-xl mx-auto">
            Every piece is made to order — crafted with premium wood, finished by hand, and delivered to your doorstep across India.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold font-body transition-all duration-200 border ${
              selectedCategory === null
                ? 'bg-royal-brown text-royal-bg border-royal-brown shadow-md'
                : 'bg-royal-bg text-royal-mahogany border-royal-border hover:border-royal-brown hover:text-royal-brown'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold font-body transition-all duration-200 border ${
                selectedCategory === cat.id
                  ? 'bg-royal-brown text-royal-bg border-royal-brown shadow-md'
                  : 'bg-royal-bg text-royal-mahogany border-royal-border hover:border-royal-brown hover:text-royal-brown'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-royal-navy/50 font-body">No products available.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product) => (
              <a
                href={`/product_detail/${product.id}`}
                key={product.id}
                className="group block bg-royal-bg rounded-2xl overflow-hidden shadow-royal-sm hover:shadow-royal-lg transition-all duration-300 hover:-translate-y-2 border border-royal-border"
              >
                {/* Image */}
                <div className="h-72 overflow-hidden relative">
                  <img
                    src={getImageUrl(product.images[0])}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-royal-mahogany/0 group-hover:bg-royal-mahogany/8 transition-colors duration-300" />
                  {product.is_featured && (
                    <span className="absolute top-3 left-3 badge-msme">Featured</span>
                  )}
                  <span className="absolute top-3 right-3 badge-handmade">Handmade</span>
                </div>

                {/* Info */}
                <div className="p-5 border-t border-royal-border">
                  <h3 className="font-display text-lg font-bold text-royal-mahogany mb-1 group-hover:text-royal-brown transition-colors truncate">
                    {product.name}
                  </h3>
                  <p className="font-body text-sm text-royal-navy/60 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-display text-2xl font-bold text-royal-brown">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                      <p className="font-body text-xs text-royal-navy/50">+ GST | Free Delivery</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-semibold font-body text-royal-brown group-hover:gap-2.5 transition-all">
                      View Details <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* WhatsApp CTA */}
        <div className="mt-14 text-center bg-royal-navy rounded-2xl p-8 shadow-royal-md">
          <p className="font-display text-xl font-bold text-royal-bg mb-2">
            Don't see what you're looking for?
          </p>
          <p className="font-body text-royal-bg/70 mb-6">
            We make custom furniture to your exact specifications. Share your idea — we'll build it.
          </p>
          <a
            href={`https://wa.me/${waNumber}?text=Hello%2C%20I%27d%20like%20to%20enquire%20about%20a%20product`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold font-body text-white transition-all hover:shadow-lg"
            style={{ backgroundColor: '#25D366' }}
          >
            <MessageCircle size={18} />
            Chat with us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
