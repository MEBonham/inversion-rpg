import { redirect } from "@sveltejs/kit";
import { createServerClient } from "@supabase/ssr";
import * as jose from "jose";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import { JWT_SECRET } from "$env/static/private";

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
        console.log({ session });
        if (!session) return null;

        try {
            const { payload: decoded } = await jose.jwtVerify(
                session.access_token,
                new TextEncoder().encode(JWT_SECRET)
            );
            const validatedSession = {
                accessToken: session.access_token,
                refreshToken: session.refresh_token,
                expiresAt: decoded.exp,
                expiresIn: decoded.exp - Math.round(Date.now() / 1000),
                tokenType: "bearer",
                user: {
                    app_metadata: decoded.app_metadata ?? {},
                    aud: "authenticated",
                    created_at: "",
                    email: decoded.email,
                    user_metadata: {
                        avatar_url: decoded.user_metadata?.avatar_url ?? "",
                        username: decoded.user_metadata?.username ?? "",
                        auth_num: decoded.auth_num ?? 0,
                    }
                }
            };
            return validatedSession;
        } catch(err) {
            console.error({err});
            return null;
        }
    }
    const session = await event.locals.getSession();

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === "content-range" || name === "x-supabase-api-version";
        },
    });
}
