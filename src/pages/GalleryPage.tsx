import { useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { useGallery } from '../hooks/useGallery';
import { useSettings } from '../hooks/useSettings';
import { getImageUrl } from '../utils/imageUtils';

const ALL = 'All';

export default function GalleryPage() {
  const { items, loading } = useGallery();
  const { settings } = useSettings();
  const [activeTag, setActiveTag] = useState(ALL);

  const tags = [ALL, ...Array.from(new Set(items.map((i) => i.category_tag).filter(Boolean) as string[]))];
  const filtered = activeTag === ALL ? items : items.filter((i) => i.category_tag === activeTag);

  const waNumber = (settings?.whatsapp_number || settings?.phone_numbers?.[0] || '').replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-royal-bg">
      <Header />
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-sm text-royal-navy/50 hover:text-royal-brown transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div className="text-center mb-14">
            <p className="font-body text-royal-brown font-semibold text-xs uppercase tracking-widest mb-3">
              Our Work
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-royal-mahogany mb-4">
              Portfolio & Gallery
            </h1>
            <p className="font-body text-royal-navy/60 max-w-xl mx-auto">
              Real pieces crafted in our Nashik workshop — delivered to homes, offices, and institutions across India.
            </p>
            <hr className="royal-divider w-20 mx-auto mt-6" />
          </div>

          {/* Tag filters */}
          {tags.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold font-body transition-all border ${
                    activeTag === tag
                      ? 'bg-royal-brown text-royal-bg border-royal-brown shadow-md'
                      : 'bg-royal-bg text-royal-mahogany border-royal-border hover:border-royal-brown'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-royal-border border-t-royal-brown rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-royal-navy/40">No photos in this category yet.</p>
              <p className="font-body text-sm text-royal-navy/30 mt-2">
                Check back soon — we update our portfolio regularly.
              </p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="break-inside-avoid group rounded-2xl overflow-hidden border border-royal-border shadow-royal-sm hover:shadow-royal-lg transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={getImageUrl(item.image_url)}
                      alt={item.title}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-royal-mahogany/0 group-hover:bg-royal-mahogany/10 transition-colors duration-300" />
                    {item.category_tag && (
                      <span className="absolute top-3 left-3 badge-msme">{item.category_tag}</span>
                    )}
                  </div>
                  <div className="bg-royal-bg p-4">
                    <h3 className="font-display text-base font-bold text-royal-mahogany mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="font-body text-sm text-royal-navy/60 mb-2 line-clamp-2">{item.description}</p>
                    )}
                    {item.location_delivered && (
                      <div className="flex items-center gap-1.5 text-xs font-body text-royal-navy/40">
                        <MapPin size={11} className="text-royal-gold" />
                        Delivered to {item.location_delivered}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          {waNumber && (
            <div className="mt-16 text-center bg-royal-navy rounded-2xl p-10 shadow-royal-md">
              <h2 className="font-display text-2xl font-bold text-royal-bg mb-3">
                Want Something Like This?
              </h2>
              <p className="font-body text-royal-bg/70 mb-7 max-w-md mx-auto">
                Share your idea on WhatsApp — we'll send you a custom quote within 24 hours.
              </p>
              <a
                href={`https://wa.me/${waNumber}?text=Hello%20Durva%20Woodcraft%2C%20I%20saw%20your%20gallery%20and%20I'd%20like%20a%20similar%20piece%20made%20for%20me.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold font-body text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#25D366' }}
              >
                Chat on WhatsApp
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
