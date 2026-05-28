import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase URL and Anon Key
// You can find these in your Supabase Dashboard under Project Settings > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://drpycecnpepgwtawpoan.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRycHljZWNucGVwZ3d0YXdwb2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjQ3MzEsImV4cCI6MjA5NDM0MDczMX0.hDvuu2WGZtnLK4kXgS1khcESXPHareblMkyoN5FAQcs';

export const supabase = createClient(supabaseUrl, supabaseKey);
