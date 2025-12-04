import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = cookies();

  // Adapt Next's cookie store to the shape expected by `createServerClient`.
  // Provide `get`, `getAll`, and `set` helpers so the Supabase SSR client
  // can read/write the auth cookies during server-side rendering.
  const cookieHelpers = {
    get(name: string) {
      const c = cookieStore.get(name);
      return c ? { name: c.name, value: c.value, options: undefined } : undefined;
    },
    getAll() {
      return cookieStore.getAll().map((c) => ({ name: c.name, value: c.value, options: undefined }));
    },
    set(name: string, value: string, options?: any) {
      try {
        cookieStore.set(name, value, options);
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
