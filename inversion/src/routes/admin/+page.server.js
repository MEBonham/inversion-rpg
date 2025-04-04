import { error, fail, redirect } from "@sveltejs/kit";
import { ADMIN_AUTH } from "$lib/constants";

export const load = async ({ locals: { supabase, getProfile } }) => {
    const profile = await getProfile();
    if (!profile || profile.auth_num < ADMIN_AUTH) {
        throw error(403, "Forbidden");
    }

    // Load blog entries written by the admin, or all for a super admin
    const { data: blogEntries, error: blogEntriesError } = await supabase.from("blog_entries")
        .select("id, title, created_at, tags, content")
        .order("created_at", { ascending: false });
    if (blogEntriesError) {
        console.error({ blogEntriesError });
        return fail(500, { message: blogEntriesError.message || "Something went wrong." });
    }
    return {
        blogEntries: blogEntries.filter((entry) => entry.author_id === profile.id || profile.auth_num > ADMIN_AUTH),
    };
};

export const actions = {
    blogPost: async ({ request, locals: { supabase, getProfile } }) => {
        const formData = await request.formData();
        const profile = await getProfile();
        if (!profile || profile.auth_num < ADMIN_AUTH) {
            throw error(403, "Forbidden");
        }

        // If editing an existing post, update it. Otherwise, create a new one.
        const editingId = parseInt(formData.get("editingId"));
        if (editingId) {
            const { error } = await supabase.from("blog_entries").update({
                title: formData.get("title"),
                tags: formData.get("tags").split(";").map((tag) => tag.trim()),
                content: JSON.parse(formData.get("content")),
                updated_at: new Date().toISOString(),
            }).eq("id", editingId);
        } else {
            const { error } = await supabase.from("blog_entries").insert({
                title: formData.get("title"),
                author_id: profile.id,
                author_label: profile.username || "Admin",
                tags: formData.get("tags").split(";").map((tag) => tag.trim()),
                content: JSON.parse(formData.get("content")),
            });
            if (error) {
                console.error({ error });
                return fail(500, { message: error.message || "Something went wrong." }, { src: "blogPost" });
            }
        }
        throw redirect(307, "/blog");
    },
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
