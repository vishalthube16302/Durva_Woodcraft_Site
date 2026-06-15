import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Settings {
  id: string;

  // ── Brand ─────────────────────────────────────────────────────
  brand_name:      string;
  logo_url:        string;
  tagline:         string;
  primary_color:   string;
  secondary_color: string;
  accent_color:    string;

  // ── Contact ───────────────────────────────────────────────────
  phone_numbers:   string[];          // Array e.g. ['9823022365', '9823022372']
  whatsapp_number: string;            // With country code, no + e.g. '919823022365'
  email:           string;
  address:         string;
  website:         string;

  // ── Government credentials (new columns added via migration) ──
  msme_number:     string;            // e.g. MH-01-0084519
  gst_number:      string;            // e.g. 27XXXXXXXXXXXXX
  gem_seller_id:   string;            // GeM portal seller ID

  // ── Social links (existing JSONB column in DB) ────────────────
  social_links: {
    instagram?: string;
    facebook?:  string;
    youtube?:   string;
  };

  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string | null;
  price: number;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  wood_type: string;
  finish_type: string;
  delivery_days: string;
  is_custom_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id?: string;
  name: string;
  email?: string | null;
  phone: string;
  message?: string | null;
  source: string;       // 'contact_form' | 'custom_order' | 'product_page'
  product_id?: string | null;
  created_at?: string;
}

export interface CustomOrder {
  id?: string;
  name: string;
  phone: string;
  email?: string | null;
  furniture_type?: string | null;
  wood_type?: string | null;
  finish?: string | null;
  dimensions?: string | null;
  budget_range?: string | null;
  notes?: string | null;
  status?: string;
  created_at?: string;
}
