import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category_tag: string | null;
  location_delivered: string | null;
  is_featured: boolean;
  display_order: number;
}

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('gallery')
      .select('*')
      .eq('is_active', true)
      .order('display_order')
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, []);

  return { items, loading };
}
