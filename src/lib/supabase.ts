import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Settings {
  id: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  brand_name: string;
  tagline: string;
  phone_numbers: string[];
  email: string;
  address: string;
  website: string;
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
