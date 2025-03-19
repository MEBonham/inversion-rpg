import { redirect } from "@sveltejs/kit";

export const load = async ({ locals: { getSession } }) => {
    const session = await getSession();
    if (!session) return redirect(307, "/login");
    return {};
}

export const actions = {
    logout: async ({ locals: { supabase } }) => {
        await supabase.auth.signOut();
    },
}
