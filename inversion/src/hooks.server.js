import { redirect } from "@sveltejs/kit";
import { createServerClient } from "@supabase/ssr";
import * as jose from "jose";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import { JWT_SECRET } from "$env/static/private";
import { getProfileOrNull } from "$lib/server/serverUtils";

export const handle = async ({ event, resolve }) => {
    event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll: () => event.cookies.getAll(),
            setAll: (cookies) => {
                cookies.forEach(({ name, value, options }) => {
                    event.cookies.set(name, value, { ...options, path: "/" })
                });
            }
        }
    });

    event.locals.getSession = async () => {
        const { data: { session } } = await event.locals.supabase.auth.getSession();
        if (!session) return null;

        const profile = await getProfileOrNull(event.locals.supabase, session.user?.id);

        try {
            const { payload: decoded } = await jose.jwtVerify(
                session.access_token,
                new TextEncoder().encode(JWT_SECRET)
            );
            const validatedSession = {
                access_token: session.access_token,
                refresh_token: session.refresh_token,
                expires_at: decoded.exp,
                expires_in: decoded.exp - Math.round(Date.now() / 1000),
                token_type: "bearer",
                user: {
                    app_metadata: decoded.app_metadata ?? {},
                    aud: "authenticated",
                    created_at: "",
                    email: decoded.email,
                    user_metadata: {
                        avatar_url: decoded.user_metadata?.avatar_url ?? "",
                    },
                    is_anonymous: decoded.is_anonymous,
                },
            };
            return validatedSession;
        } catch(err) {
            console.error({err});
            return null;
        }
    }

    event.locals.getProfile = async () => {
        const { data: { user } } = await event.locals.supabase.auth.getUser();
        const profile = await getProfileOrNull(event.locals.supabase, user?.id);
        return profile;
    }

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === "content-range" || name === "x-supabase-api-version";
        },
    });
}
