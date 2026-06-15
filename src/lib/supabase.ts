import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Used for client-side and normal requests
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Used for server-side API routes to bypass RLS (requires SUPABASE_SERVICE_ROLE_KEY in .env.local)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
);
