import { redirect } from "@sveltejs/kit";

export const GET = async ({ url, locals: { supabase } }) => {
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") ?? "/";

    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            redirect(303, `/${next.slice(1)}`);
        }
    }
    redirect(303, "/");
}
