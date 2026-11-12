import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { env } from "@/lib/env";

/** Cookie-bound client: acts as the signed-in user, RLS applies. */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component; proxy.ts refreshes the session.
        }
      },
    },
  });
}

/** Anonymous client for public read models (no cookies, cache-friendly). */
export function createPublicClient() {
  return createSupabaseClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
