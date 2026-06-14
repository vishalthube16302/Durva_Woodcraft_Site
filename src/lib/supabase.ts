import { createClient } from '@supabase/supabase-js';

const supabaseUrl    = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Settings {
  id: string;

  // ── Brand basics ───────────────────────────────────────────────
  logo_url:        string;
  brand_name:      string;
  tagline:         string;
  primary_color:   string;
  secondary_color: string;
  accent_color:    string;

  // ── Contact ────────────────────────────────────────────────────
  phone_numbers:   string[];
  whatsapp_number: string;       // separate WhatsApp number (can differ from call number)
  email:           string;
  address:         string;
  website:         string;

  // ── Government / Business credentials ─────────────────────────
  msme_number:     string;       // e.g. MH-01-0084519
  gst_number:      string;       // e.g. 27XXXXXXXXXXXXX
  gem_seller_id:   string;       // GeM portal seller ID

  // ── Social media ───────────────────────────────────────────────
  instagram_url:   string;
  facebook_url:    string;
  youtube_url:     string;

  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
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
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id?: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  source: string;          // 'contact_form' | 'custom_order' | 'product_page'
  product_id?: string | null;
  created_at?: string;
}
