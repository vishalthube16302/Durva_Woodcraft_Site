import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

interface PolicyContent {
  title: string;
  content: string;
  updated_at: string;
}

export default function PolicyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [policy, setPolicy] = useState<PolicyContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('policy_pages')
      .select('title, content, updated_at')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        setPolicy(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-bg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-royal-border border-t-royal-brown rounded-full animate-spin" />
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen bg-royal-bg flex flex-col items-center justify-center gap-4">
        <p className="font-body text-royal-navy/60">Page not found.</p>
        <Link to="/" className="font-body text-sm text-royal-brown hover:text-royal-mahogany">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const updated = new Date(policy.updated_at).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-royal-bg">
      <Header />
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-sm text-royal-navy/50 hover:text-royal-brown transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-royal-mahogany mb-3">
            {policy.title}
          </h1>
          <p className="font-body text-xs text-royal-navy/40 mb-10">Last updated: {updated}</p>

          <hr className="royal-divider w-16 mb-10" style={{ marginLeft: 0, transform: 'none' }} />

          <div
            className="policy-content font-body text-royal-navy/80 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: policy.content }}
          />
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
