import { Link } from 'react-router-dom';
import { Home, MessageCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-royal-bg flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md">
        {/* Wood grain decorative number */}
        <div className="font-display text-[120px] font-bold leading-none text-royal-border select-none mb-2">
          404
        </div>
        <h1 className="font-display text-2xl font-bold text-royal-mahogany mb-3">
          Page Not Found
        </h1>
        <p className="font-body text-royal-navy/60 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back to our handcrafted collection.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="royal-btn-primary flex items-center justify-center gap-2 px-8 py-3">
            <Home size={16} />
            Back to Home
          </Link>
          <a
            href="https://wa.me/91XXXXXXXXXX?text=Hello%20Durva%20Woodcraft!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-full border-2 border-royal-brown text-royal-brown font-semibold font-body text-sm hover:bg-royal-brown hover:text-royal-bg transition-all"
          >
            <MessageCircle size={16} />
            WhatsApp Us
          </a>
        </div>
        {/* Decorative wood divider */}
        <div className="mt-12 royal-divider w-32" />
        <p className="font-body text-xs text-royal-navy/40 mt-4">
          Durva Woodcraft — Handcrafted in Maharashtra
        </p>
      </div>
    </div>
  );
}
