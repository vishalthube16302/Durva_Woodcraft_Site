import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, Product } from '../lib/supabase';
import { useSettings } from '../hooks/useSettings';
import { Truck, Phone, MessageCircle, Share2, Heart, ShoppingCart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
                // Fetch current product
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

                // Fetch related products (same category, different ID)
                if (productData.category_id) {
                    const { data: relatedData } = await supabase
                        .from('products')
                        .select('*')
                        .eq('category_id', productData.category_id)
                        .neq('id', productData.id)
                        .limit(6);

                    if (relatedData) setRelatedProducts(relatedData);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
        // Scroll to top when ID changes
        window.scrollTo(0, 0);
    }, [id]);

    if (loading || !settings) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: settings?.primary_color || '#000' }}></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex flex-col items-center justify-center text-gray-600 pt-24">
                    <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                    <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-grow pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                        <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium truncate">{product.name}</span>
                    </nav>

                    <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-16">
                        <div className="grid lg:grid-cols-2 gap-0">
                            {/* Left Column - Image Gallery */}
                            <div className="p-8 lg:p-12 bg-gray-50/50">
                                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm mb-6 group">
                                    <img
                                        src={getImageUrl(activeImage)}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <button className="absolute top-4 right-4 p-3 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 transition-all shadow-sm backdrop-blur-sm">
                                        <Heart size={20} />
                                    </button>
                                </div>

                                {product.images && product.images.length > 1 && (
                                    <div className="grid grid-cols-4 gap-4">
                                        {product.images.map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveImage(img)}
                                                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-opacity-100' : 'border-transparent hover:border-gray-200'
                                                    }`}
                                                style={{ borderColor: activeImage === img ? settings.primary_color : undefined }}
                                            >
                                                <img src={getImageUrl(img)} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Product Info */}
                            <div className="p-8 lg:p-12 flex flex-col">
                                <div className="mb-auto">
                                    <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
                                        {product.name}
                                    </h1>

                                    <div className="flex items-baseline gap-4 mb-8">
                                        <span className="text-3xl font-bold" style={{ color: settings.primary_color }}>
                                            ₹{product.price.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-gray-500 font-medium">+ GST</span>
                                    </div>

                                    <div className="prose prose-stone mb-8 text-gray-600 leading-relaxed">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-2">Description</h3>
                                        <p>{product.description}</p>
                                    </div>

                                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Specifications</h3>
                                            <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                                {Object.entries(product.specifications).map(([key, value], index) => (
                                                    <div
                                                        key={key}
                                                        className={`flex p-4 text-sm ${index !== Object.entries(product.specifications).length - 1 ? 'border-b border-gray-100' : ''}`}
                                                    >
                                                        <span className="w-1/3 text-gray-500 font-medium">{key}</span>
                                                        <span className="w-2/3 text-gray-900">{value as string}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {product.features && product.features.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Features</h3>
                                            <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                                {product.features.map((feature, index) => (
                                                    <div
                                                        key={index}
                                                        className={`flex p-4 text-sm ${index !== product.features.length - 1 ? 'border-b border-gray-100' : ''}`}
                                                    >
                                                        <span className="w-1/3 text-gray-500 font-medium">Feature {index + 1}</span>
                                                        <span className="w-2/3 text-gray-900">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6 pt-8 border-t border-gray-100">
                                    <button
                                        onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="w-full py-4 rounded-xl text-white font-medium text-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg transform active:scale-[0.98]"
                                        style={{ backgroundColor: settings.primary_color }}
                                    >
                                        <MessageCircle size={20} />
                                        Send Inquiry
                                    </button>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                                            <Share2 size={18} />
                                            Share Product
                                        </button>
                                        <button
                                            onClick={() => document.getElementById('contact-scroll-target')?.scrollIntoView({ behavior: 'smooth' })}
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            <Phone size={18} />
                                            Call Us
                                        </button>
                                    </div>

                                    {/* Delivery Info */}
                                    <div className="bg-blue-50/50 rounded-xl p-4 flex gap-4 items-start">
                                        <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                                            <Truck size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 text-sm">Delivery Information</h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                We deliver across India. Delivery time ranges from 5-7 business days for standard items. Custom orders may take 2-4 weeks.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-6" style={{ color: settings.primary_color }}>Related Products</h2>
                            <div className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x">
                                {relatedProducts.map((related) => (
                                    <Link
                                        to={`/product_detail/${related.id}`}
                                        key={related.id}
                                        className="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 snap-start"
                                    >
                                        <div className="h-48 overflow-hidden relative group">
                                            <img
                                                src={getImageUrl(related.images[0])}
                                                alt={related.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-bold mb-1 truncate" style={{ color: settings.primary_color }}>
                                                {related.name}
                                            </h3>
                                            <p className="text-gray-500 text-sm mb-3 line-clamp-2">{related.description}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold" style={{ color: settings.primary_color }}>
                                                    ₹{related.price.toLocaleString()}
                                                </span>
                                                <div className="p-2 rounded-full bg-gray-50 text-gray-600">
                                                    <ShoppingCart size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact Section Placeholder for Scroll */}
                    <div id="contact-scroll-target" className="h-0"></div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
