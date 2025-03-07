import { fail } from "@sveltejs/kit";
import { getProfileOrNull } from "$lib/utils";

export const load = async ({ locals: { safeGetSession, supabase } }) => {
    const { user } = await safeGetSession();
    const profile = await getProfileOrNull(supabase, user?.id);

    const { data: allCampaigns, error: campaignError } = await supabase.from("campaigns").select("*");
    if (campaignError) {
        console.error({ campaignError });
        return fail(500, { message: campaignError.message || "Something went wrong." });
    }

    const { data: allCharacters, error: charactersError } = await supabase.from("characters")
        .select("secret, owner, campaign, character_name, slug");
    if (charactersError) {
        console.error({ charactersError });
        return fail(500, { message: charactersError.message || "Something went wrong." });
    }

    return { allCampaigns, allCharacters };
}
