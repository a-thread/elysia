import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safely extract environment variables
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

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
const supabase: SupabaseClient = createClient(API_URL, API_KEY);

// Add request cancellation logic
class SupabaseClientWithAbort {
  private client: SupabaseClient;
  private abortControllers: Map<string, AbortController>;

  constructor(client: SupabaseClient) {
    this.client = client;
    this.abortControllers = new Map();
  }

  request = async <T>(
    requestKey: string,
    requestFunction: (client: SupabaseClient) => Promise<T>
  ): Promise<T | null> => {
    // Cancel any existing request with the same key
    if (this.abortControllers.has(requestKey)) {
      this.abortControllers.get(requestKey)?.abort();
    }

    // Create a new AbortController
    const controller = new AbortController();
    this.abortControllers.set(requestKey, controller);

    try {
      return await requestFunction(this.client);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log(`Request "${requestKey}" was aborted.`);
        return null;
      }
      throw error;
    } finally {
      this.abortControllers.delete(requestKey);
    }
  };
}

// Export wrapped Supabase client with request cancellation
export const supabaseWithAbort = new SupabaseClientWithAbort(supabase);
