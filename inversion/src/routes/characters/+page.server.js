import { fail } from "@sveltejs/kit";
import { clamp, getProfileOrNull } from "$lib/utils";
import { MIN_CHARACTER_LEVEL, MAX_CHARACTER_LEVEL } from "$lib/constants";

export const load = async ({ locals: { safeGetSession, supabase, getProfile } }) => {
    const profile = await getProfile();

    const { data: allCampaigns, error: campaignError } = await supabase.from("campaigns").select("*");
    if (campaignError) {
        console.error({ campaignError });
        return fail(500, { message: campaignError.message || "Something went wrong." });
    }

    const { data: allCharacters, error: charactersError } = await supabase.from("characters")
        .select("secret, owner, setting, character_name, slug");
    if (charactersError) {
        console.error({ charactersError });
        return fail(500, { message: charactersError.message || "Something went wrong." });
    }

    return {
        allCampaigns: allCampaigns.sort((a, b) => a.campaign_title.toUpperCase().localeCompare(b.campaign_title.toUpperCase())),
        allCharacters
    };
}

export const actions = {
    newCharacter: async ({ request, locals: { safeGetSession, supabase, getProfile } }) => {
        const formData = await request.formData();
        const profile = await getProfile();
        if (!profile) {
            throw error(403, "Forbidden");
        }

        const campaignId = parseInt(formData.get("campaignId"));
        const { data: campaignToAddTo, error: campaignError } = await supabase.from("campaigns")
            .select("id, creator, participate_passcode")
            .eq("id", campaignId)
            .single();
        if (campaignError) {
            console.error({ campaignError });
            return fail(500, { message: campaignError.message || "Something went wrong.", src: "newCharacter" });
        }
        if (campaignToAddTo.creator !== profile.id && !profile.passcodes.includes(campaignToAddTo.participate_passcode)) {
            throw error(403, "Forbidden");
        }

        // TODO: zod
        const character_name = formData.get("character_name");

        const slug = encodeURI(formData.get("slug").trim().toLowerCase());
        let { data: dupSlug, error: dupSlugError } = await supabase.from("characters")
            .select("id")
            .eq("slug", slug);
        let extraSlugNum = 1;
        while (!dupSlugError && dupSlug.length > 0) {
            extraSlugNum++;
            let { data: dbDupSlug, error: dbDupSlugError } = await supabase.from("characters")
                .select("id")
                .eq("slug", `${slug}-${extraSlugNum}`);
            dupSlug = dbDupSlug;
            dupSlugError = dbDupSlugError;
        }
        if (dupSlugError) {
            console.error({ dupSlugError });
            return fail(500, { message: dupSlugError.message || "Something went wrong.", src: "newCharacter" });
        }
        let slugToUse = extraSlugNum > 1 ? `${slug}-${extraSlugNum}` : slug;

        const { error: creationError } = await supabase.from("characters").insert({
            secret: formData.get("secret") === "false" ? false : true,
            owner: profile.id,
            setting: campaignId,
            character_name,
            slug: slugToUse,
            character_level: clamp(parseInt(formData.get("level")), MIN_CHARACTER_LEVEL, MAX_CHARACTER_LEVEL),
            is_inheritor_of_best_wishes: formData.get("inheritorOfBestWishes") === "true",
        });
        if (creationError) {
            console.error({ creationError });
            return fail(500, { message: creationError.message || "Something went wrong.", src: "newCharacter" });
        }
        return {};
    },
}
