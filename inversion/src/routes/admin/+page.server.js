import { fail } from "@sveltejs/kit";
import { ADMIN_AUTH } from "$lib/constants";

export const actions = {
    newBackground: async ({ request, locals: { supabase, getProfile } }) => {
        const formData = await request.formData();
        const profile = await getProfile();
        if (!profile || profile.auth_num < ADMIN_AUTH) {
            throw error(403, "Forbidden");
        }

        const { error } = await supabase.from("backgrounds").insert({
            background_name: formData.get("name"),
            description: formData.get("bonus"),
        });
        if (error) {
            console.error({ error });
            return fail(500, { message: error.message || "Something went wrong." }, { src: "newBackground" });
        }
        return {};
    },
    newLanguage: async ({ request, locals: { supabase, getProfile } }) => {
        const formData = await request.formData();
        const profile = await getProfile();
        if (!profile || profile.auth_num < ADMIN_AUTH) {
            throw error(403, "Forbidden");
        }

        const { error } = await supabase.from("languages").insert({
            language_name: formData.get("name"),
            description: formData.get("description"),
        });
        if (error) {
            console.error({ error });
            return fail(500, { message: error.message || "Something went wrong." }, { src: "newLanguage" });
        }
        return {};
    },
};
