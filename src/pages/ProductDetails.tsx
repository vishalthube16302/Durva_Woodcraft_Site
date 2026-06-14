import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, Product } from '../lib/supabase';
import { useSettings } from '../hooks/useSettings';
import {
  Truck, Phone, MessageCircle, Share2, ArrowLeft,
  Award, Shield, CheckCircle, QrCode
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { getImageUrl } from '../utils/imageUtils';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const { settings } = useSettings();

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        if (productError) throw productError;
        setProduct(productData);
        if (productData.images && productData.images.length > 0) {
          setActiveImage(productData.images[0]);
        }
        if (productData.category_id) {
          const { data: relatedData } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', productData.category_id)
            .neq('id', productData.id)
            .limit(4);
          if (relatedData) setRelatedProducts(relatedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-royal-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-2 border-royal-border border-t-royal-brown rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-royal-navy/60 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-royal-bg flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-24">
          <h2 className="font-display text-2xl font-bold text-royal-mahogany mb-3">Product not found</h2>
          <p className="font-body text-royal-navy/60 mb-6">This product may have been removed or the link is incorrect.</p>
          <Link to="/" className="royal-btn-primary px-8 py-3 inline-block">Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const waNumber = settings.phone_numbers?.[0]?.replace(/\D/g, '') || '';
  const waMessage = encodeURIComponent(
    `Hello Durva Woodcraft! I'm interested in "${product.name}" (₹${product.price.toLocaleString('en-IN')}). Please share more details.`
  );
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  return (
    <div className="min-h-screen bg-royal-bg flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-body text-royal-navy/50 mb-8">
            <Link to="/" className="hover:text-royal-brown transition-colors flex items-center gap-1">
              <ArrowLeft size={14} /> Home
            </Link>
            <span>/</span>
            <span className="text-royal-mahogany font-medium truncate">{product.name}</span>
          </nav>

          {/* Main product card */}
          <div className="bg-royal-bg rounded-2xl border border-royal-border shadow-royal-md overflow-hidden mb-14">
            <div className="grid lg:grid-cols-2 gap-0">

              {/* Left — Image Gallery */}
              <div className="p-6 lg:p-10 bg-royal-surface/30">
                <div className="relative aspect-square rounded-xl overflow-hidden border border-royal-border shadow-royal-sm mb-4 group">
                  <img
                    src={getImageUrl(activeImage)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {product.is_featured && (
                    <span className="absolute top-3 left-3 badge-msme">Featured</span>
                  )}
                  <span className="absolute top-3 right-3 badge-handmade">100% Handmade</span>
                </div>

                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(img)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === img
                            ? 'border-royal-brown shadow-royal-sm'
                            : 'border-royal-border hover:border-royal-brown/50'
                        }`}
                      >
                        <img src={getImageUrl(img)} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right — Product Info */}
              <div className="p-6 lg:p-10 flex flex-col">
                <div className="mb-auto">

                  {/* Title */}
                  <h1 className="font-display text-3xl lg:text-4xl font-bold text-royal-mahogany mb-3 leading-tight">
                    {product.name}
                  </h1>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-royal-border">
                    <span className="font-display text-4xl font-bold text-royal-brown">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="font-body text-sm text-royal-navy/50">+ GST | Free Delivery</span>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-royal-brown mb-2">Description</h3>
                    <p className="font-body text-royal-navy/70 leading-relaxed">{product.description}</p>
                  </div>

                  {/* Specifications */}
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-royal-brown mb-3">Specifications</h3>
                      <div className="rounded-xl overflow-hidden border border-royal-border">
                        {Object.entries(product.specifications).map(([key, value], index, arr) => (
                          <div
                            key={key}
                            className={`flex p-3 text-sm font-body ${index !== arr.length - 1 ? 'border-b border-royal-border' : ''} ${index % 2 === 0 ? 'bg-royal-surface/40' : 'bg-royal-bg'}`}
                          >
                            <span className="w-2/5 text-royal-navy/60 font-medium">{key}</span>
                            <span className="w-3/5 text-royal-mahogany font-semibold">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-royal-brown mb-3">Key Features</h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 font-body text-sm text-royal-navy/70">
                            <CheckCircle size={15} className="text-royal-gold mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-4 pt-6 border-t border-royal-border">

                  {/* Primary CTA — WhatsApp */}
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-xl text-white font-semibold font-body text-base flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <MessageCircle size={20} />
                    Get Price on WhatsApp
                  </a>

                  {/* Secondary CTAs */}
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`tel:${settings.phone_numbers?.[0]}`}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl border border-royal-border text-royal-mahogany font-body font-semibold text-sm hover:bg-royal-surface hover:border-royal-brown transition-all"
                    >
                      <Phone size={16} className="text-royal-brown" />
                      Call Us
                    </a>
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl border border-royal-border text-royal-mahogany font-body font-semibold text-sm hover:bg-royal-surface hover:border-royal-brown transition-all"
                    >
                      <Share2 size={16} className="text-royal-brown" />
                      Share
                    </button>
                  </div>

                  {/* Delivery info */}
                  <div className="bg-royal-surface rounded-xl p-4 flex gap-3 items-start border border-royal-border">
                    <div className="p-2 bg-royal-mahogany rounded-lg flex-shrink-0">
                      <Truck size={16} className="text-royal-bg" />
                    </div>
                    <div>
                      <h4 className="font-body font-semibold text-royal-mahogany text-sm">Pan-India Delivery</h4>
                      <p className="font-body text-xs text-royal-navy/60 mt-0.5 leading-relaxed">
                        Ready items: 5–7 days • Custom orders: 14–21 days • Safe packaging guaranteed.
                      </p>
                    </div>
                  </div>

                  {/* UPI Payment section */}
                  <div className="bg-royal-navy rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <QrCode size={16} className="text-royal-gold" />
                      <h4 className="font-body font-semibold text-royal-bg text-sm">Pay Directly via UPI</h4>
                    </div>
                    <p className="font-body text-xs text-royal-bg/60 mb-3 leading-relaxed">
                      Scan QR or use UPI ID to pay advance. Balance on delivery. WhatsApp us your payment screenshot after paying.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['UPI', 'PhonePe', 'GPay', 'Paytm', 'COD Available'].map(m => (
                        <span key={m} className="text-xs font-body px-2.5 py-1 rounded bg-royal-bg/10 text-royal-bg/80 border border-royal-bg/20">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-body text-royal-navy/60">
                      <Award size={13} className="text-royal-gold" />
                      MSME Certified
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-body text-royal-navy/60">
                      <Shield size={13} className="text-royal-gold" />
                      Quality Guarantee
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-body text-royal-navy/60">
                      <CheckCircle size={13} className="text-royal-gold" />
                      100% Handmade
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <div className="text-center mb-8">
                <p className="font-body text-royal-brown font-semibold text-xs uppercase tracking-widest mb-2">You May Also Like</p>
                <h2 className="font-display text-2xl font-bold text-royal-mahogany">Related Products</h2>
                <hr className="royal-divider w-16 mt-4" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((related) => (
                  <Link
                    to={`/product_detail/${related.id}`}
                    key={related.id}
                    className="group block bg-royal-bg rounded-2xl overflow-hidden border border-royal-border shadow-royal-sm hover:shadow-royal-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="h-52 overflow-hidden">
                      <img
                        src={getImageUrl(related.images[0])}
                        alt={related.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 border-t border-royal-border">
                      <h3 className="font-display text-base font-bold text-royal-mahogany mb-1 truncate group-hover:text-royal-brown transition-colors">
                        {related.name}
                      </h3>
                      <p className="font-body text-sm text-royal-navy/60 line-clamp-2 mb-3">{related.description}</p>
                      <p className="font-display text-xl font-bold text-royal-brown">
                        ₹{related.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
