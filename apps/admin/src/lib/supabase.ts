import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Film {
  id: string;
  title: string;
  description: string;
  creator: string;
  status: 'Published' | 'Processing' | 'Draft';
  views: number;
  revenue: number;
  poster_url: string;
  video_url: string;
  duration: number;
  release_date: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'Premium' | 'Basic' | 'Free';
  status: 'Active' | 'Suspended' | 'Cancelled';
  joined: string;
  revenue: number;
}
