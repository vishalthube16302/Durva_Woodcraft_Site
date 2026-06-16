import { Star, Quote } from 'lucide-react';
import { useTestimonials } from '../hooks/useTestimonials';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? 'text-royal-gold fill-royal-gold' : 'text-royal-border'}
          fill={s <= rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { testimonials, loading } = useTestimonials(true);

  if (loading || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 bg-royal-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-body text-royal-brown font-semibold text-xs uppercase tracking-widest mb-3">
            Customer Stories
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-royal-mahogany mb-4">
            What Our Customers Say
          </h2>
          <p className="font-body text-royal-navy/60 max-w-xl mx-auto">
            Real customers, real furniture — delivered across Maharashtra and beyond.
          </p>
          <hr className="royal-divider w-20 mx-auto mt-6" />
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-royal-surface/40 rounded-2xl p-6 border border-royal-border hover:shadow-royal-md transition-shadow relative"
            >
              {/* Quote icon */}
              <Quote
                size={32}
                className="text-royal-gold/20 absolute top-5 right-5"
                fill="currentColor"
              />

              {/* Rating */}
              <div className="mb-4">
                <StarRating rating={t.rating} />
              </div>

              {/* Review text */}
              <p className="font-body text-sm text-royal-navy/70 leading-relaxed mb-5 line-clamp-4">
                "{t.review_text}"
              </p>

              {/* Customer info */}
              <div className="flex items-center gap-3 pt-4 border-t border-royal-border">
                {/* Avatar initials */}
                <div className="w-10 h-10 rounded-full bg-royal-mahogany flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-sm font-bold text-royal-bg">
                    {t.customer_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-royal-mahogany">
                    {t.customer_name}
                  </p>
                  <p className="font-body text-xs text-royal-navy/50">
                    {t.customer_city}, {t.customer_state}
                    {t.product_purchased && (
                      <> · <span className="text-royal-brown">{t.product_purchased}</span></>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-royal-surface/60 border border-royal-border rounded-full px-6 py-3">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={14} className="text-royal-gold fill-royal-gold" fill="currentColor" />
              ))}
            </div>
            <span className="font-body text-sm text-royal-mahogany font-semibold">
              1000+ Happy Families Across India
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
