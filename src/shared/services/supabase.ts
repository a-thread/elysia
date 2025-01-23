import { createClient } from '@supabase/supabase-js';

// Safely extract environment variables
export const API_URL = import.meta.env.VITE_API_URL;
export const API_KEY = import.meta.env.VITE_API_KEY;

// Ensure environment variables are properly set
if (!API_URL) {
  console.error('Supabase URL is missing! Check your environment variables.');
  throw new Error('Missing API_URL in environment variables.');
}

if (!API_KEY) {
  console.error('Supabase Anon Key is missing! Check your environment variables.');
  throw new Error('Missing API_KEY in environment variables.');
}

// Create Supabase client
export const supabase = createClient(API_URL, API_KEY);
