
export const getProfileOrNull = async (clientInstance, userId) => {
    if (!userId) return null;
    const { data, error } = await clientInstance.from("profiles")
        .select()
        .eq("id", userId)
        .single()
    if (error) {
        console.error({ error });
        return null;
    }
    return data;
}

export const verifyEditPermission = async (clientInstance, getProfile, characterId) => {
    const profile = await getProfile();
    if (!profile) {
        return false;
    }

    const { data: character, error: characterError } = await clientInstance.from("characters")
        .select("owner")
        .eq("id", characterId)
        .single();
    if (characterError) {
        console.error({ characterError });
        return false;
    }
    if (character.owner === profile.id) return true;

    const { data: campaign, error: campaignError } = await clientInstance.from("campaigns")
        .select("creator")
        .eq("id", character.setting)
        .single();
    if (campaignError) {
        console.error({ campaignError });
        return false;
    }
    if (campaign.creator === profile.id) return true;

    return false;
}
