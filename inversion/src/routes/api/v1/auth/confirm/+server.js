import { redirect } from "@sveltejs/kit";

export const GET = async ({ url, locals: { supabase } }) => {
    const tokenHash = url.searchParams.get("token_hash");
    const type = url.searchParams.get("type");
    const next = url.searchParams.get("next") ?? "/";

    if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({ tokenHash, type });
        if (!error) {
            redirect(303, `/${next.slice(1)}`);
        }
    }
    redirect(303, "/");    
}
