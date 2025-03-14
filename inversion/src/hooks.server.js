import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import { createServerClient } from "@supabase/ssr";

export const handle = async ({ event, resolve }) => {
    event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll: () => event.cookies.getAll(),
            setAll: (cookiesToSet) => {
                cookiesToSet.forEach(({ name, value, options }) => {
                    event.cookies.set(name, value, { ...options, path: "/" });
                });
            }
        }
    });

    event.locals.safeGetSession = async () => {
        const { data: { session }, error: sessionError } = await event.locals.supabase.auth.getSession();
        if (sessionError) console.error({ sessionError });
        if (!session) return { session: null, user: null };

        const { data: { user }, error } = await event.locals.supabase.auth.getUser();
        if (error) console.error({ error });
        return error ? { session: null, user: null } : { session, user };
    };

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === "content-range" || name === "x-supabase-api-version";
        }
    });
}
