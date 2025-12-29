import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

const getSupabaseClient = (): SupabaseClient => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build/SSR, create a placeholder client to prevent build errors
    // This will only be used during prerendering, not in actual runtime
    if (typeof window === 'undefined') {
      return createClient('https://placeholder.supabase.co', 'placeholder-key');
    }
    // In browser, throw error if env vars are missing
    throw new Error('Missing Supabase environment variables');
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
};

// Export a getter that lazily initializes
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

