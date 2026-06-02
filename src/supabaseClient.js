import { createClient } from '@supabase/supabase-js';

// Fallback to placeholder credentials if environment variables are not set.
// This prevents the application from crashing and lets it gracefully use local default data.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase URL or Anon Key is missing. Please create a `.env` file in the project root with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isUsingPlaceholder = supabaseUrl.includes('placeholder-project');
