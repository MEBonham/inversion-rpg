import { redirect } from "@sveltejs/kit";
import { getProfileOrNull } from "$lib/utils";

export const load = async ({ locals: { safeGetSession, supabase } }) => {
    const { session, user } = await safeGetSession();
    if (!session) {
        throw redirect(303, "/login");
    }
    const profile = await getProfileOrNull(supabase, user.id);
    if (!profile || profile.privilege < 1) {
        throw redirect(303, "/login");
    }
    return {};
}

export const actions = {
    logout: async ({ locals: { supabase, safeGetSession } }) => {
        const { session } = await safeGetSession();
        if (session) {
            await supabase.auth.signOut();
            throw redirect(303, "/");
        }
    },
}
