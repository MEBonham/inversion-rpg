
export const load = async ({ locals: { supabase }, params }) => {
    const { data: character, error: characterError } = await supabase.from("characters")
        .select("*")
        .eq("slug", params.slug)
        .single();
    if (characterError) {
        console.error({ characterError });
        return fail(500, { message: characterError.message || "Something went wrong." });
    }

    const { data: originCampaign, error: originError } = await supabase.from("campaigns")
        .select("creator, view_passcode, participate_passcode")
        .eq("id", character.campaign)
        .single();
    if (originError) {
        console.error({ originError });
        return fail(500, { message: originError.message || "Something went wrong." });
    }
    return { character, originCampaign };
}
