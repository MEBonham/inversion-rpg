import { fail } from "@sveltejs/kit";
import { verifyEditPermission } from "$lib/server/serverUtils";

export const load = async ({ locals: { supabase }, params }) => {
    const { data: character, error: characterError } = await supabase.from("characters")
        .select("*")
        .eq("slug", params.slug)
        .single();
    if (characterError) {
        console.error({ characterError });
        return fail(500, { message: characterError.message || "Something went wrong." });
    }

    const { data: backstories, error: backstoriesError } = await supabase.from("backstories")
        .select("*")
        .eq("owner", character.id)
        .order("is_rumor", { ascending: true });
    if (backstoriesError) {
        console.error({ backstoriesError });
        return fail(500, { message: backstoriesError.message || "Something went wrong." });
    }

    const { data: originCampaign, error: originError } = await supabase.from("campaigns")
        .select("creator, view_passcode, participate_passcode")
        .eq("id", character.setting)
        .single();
    if (originError) {
        console.error({ originError });
        return fail(500, { message: originError.message || "Something went wrong." });
    }
    return { character, backstories, originCampaign };
}

export const actions = {
    addRumor: async ({ request, locals: { supabase, getProfile } }) => {
        const formData = await request.formData();
        const characterId = formData.get("editingId");
        if (!verifyEditPermission(supabase, getProfile, characterId)) {
            return fail(403, { message: "Forbidden" }, { src: "addRumor" });
        }

        const { error } = await supabase.from("backstories").insert({
            owner: characterId,
            is_rumor: formData.get("isRumor") === "true",
            is_true: formData.get("isTrueRumor") === "true",
            short_summary: formData.get("rumorSummary"),
            description: formData.get("rumorDetails"),
        });
        if (error) {
            console.error({ error });
            return fail(500, { message: error.message || "Something went wrong." }, { src: "addRumor" });
        }
        return {};
    },
    deleteBackstory: async ({ request, locals: { supabase, getProfile } }) => {
        const formData = await request.formData();
        const backstoryId = formData.get("backstoryIdToDelete");
        const { data: backstory, error: backstoryError } = await supabase.from("backstories")
            .select("*")
            .eq("id", backstoryId)
            .single();
        if (backstoryError) {
            console.error({ backstoryError });
            return fail(500, { message: backstoryError.message || "Something went wrong." }, { src: "deleteBackstory" });
        }

        if (!verifyEditPermission(supabase, getProfile, backstory.owner)) {
            return fail(403, { message: "Forbidden" }, { src: "deleteBackstory" });
        }

        await supabase.from("backstories").delete().eq("id", backstoryId);
        return {};
    },
};
