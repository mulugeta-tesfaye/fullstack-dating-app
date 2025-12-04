import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  // Provide the `getAll` and `setAll` helpers expected by `@supabase/ssr`.
  const cookieHelpers = {
    getAll() {
      return cookieStore.getAll().map((c) => ({ name: c.name, value: c.value, options: undefined }));
    },
    setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
      try {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      } catch (e) {
        // ignore set errors during certain server rendering phases
      }
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieHelpers,
    }
  );
}
