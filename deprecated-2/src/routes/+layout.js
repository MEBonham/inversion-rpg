import { createBrowserClient, createServerClient, isBrowser } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import { getProfileOrNull } from "$lib/utils.js";

export const load = async ({ fetch, data, depends }) => {
    depends("supabase:auth");

    const supabase = isBrowser ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: { fetch }
    }) : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: { fetch },
        cookies: {
            getAll: () => data.cookies,
        }
    });

    const { data: { session } } = await supabase.auth.getSession();
    const profile = await getProfileOrNull(supabase, session?.user?.id);

    return { supabase, session, profile };
}
