import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_city: string;
  customer_state: string;
  product_purchased: string | null;
  rating: number;
  review_text: string;
  photo_url: string | null;
  is_featured: boolean;
  display_order: number;
}

export function useTestimonials(featuredOnly = false) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      let q = supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (featuredOnly) q = q.eq('is_featured', true);
      const { data } = await q;
      setTestimonials(data || []);
      setLoading(false);
    }
    fetch();
  }, [featuredOnly]);

  return { testimonials, loading };
}
