import { fail } from "@sveltejs/kit";
import { verifyEditPermission } from "$lib/server/serverUtils";
import { BASE_SKILLS } from "$lib/constants";

export const load = async ({ locals: { supabase }, params }) => {
    const { data: character, error: characterError } = await supabase.from("characters")
        .select(`
            *,
            character_backgrounds (
                backgrounds (*)
            ),
            character_ancestries (
                ancestries (*)
            ),
            character_languages (
                languages (*)
            )
        `).eq("slug", params.slug)
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
    saveAncestries: async ({ request, locals: { supabase, getProfile } }) => {
        const formData = await request.formData();
        const characterId = formData.get("character_id");
        if (!verifyEditPermission(supabase, getProfile, characterId)) {
            return fail(403, { message: "Forbidden" }, { src: "saveAncestries" });
        }

        const ancestryIds = JSON.parse(formData.get("ancestries"))
            .map((ancestry) => ancestry.id);
        const insertData = ancestryIds.map((ancestryId) => ({
            character: characterId,
            ancestry: ancestryId,
        }));

        await supabase.from("character_ancestries")
            .delete()
            .eq("character", characterId);
        
        const { error } = await supabase.from("character_ancestries")
            .insert(insertData);
        if (error) {
            console.error({ error });
            return fail(500, { message: error.message || "Something went wrong." }, { src: "saveBackgrounds" });
        }
        
        return {};
    },
    saveBackgrounds: async ({ request, locals: { supabase, getProfile } }) => {
        const formData = await request.formData();
        const characterId = formData.get("character_id");
        if (!verifyEditPermission(supabase, getProfile, characterId)) {
            return fail(403, { message: "Forbidden" }, { src: "saveBackgrounds" });
        }

        const backgroundIds = JSON.parse(formData.get("backgrounds"))
            .map((background) => background.id);
        const insertData = backgroundIds.map((backgroundId) => ({
            character: characterId,
            background: backgroundId,
        }));

        await supabase.from("character_backgrounds")
            .delete()
            .eq("character", characterId);
        
        const { error } = await supabase.from("character_backgrounds")
            .insert(insertData);
        if (error) {
            console.error({ error });
            return fail(500, { message: error.message || "Something went wrong." }, { src: "saveBackgrounds" });
        }
        
        return {};
    },
    saveColumn: async ({ request, locals: { supabase, getProfile } }) => {
        const formData = await request.formData();
        const characterId = formData.get("character_id");
        if (!verifyEditPermission(supabase, getProfile, characterId)) {
            return fail(403, { message: "Forbidden" }, { src: "saveColumn" });
        }

        const { error: updateError } = await supabase.from("characters")
            .update({ [formData.get("whichColumn")]: parseInt(formData.get("value")) })
            .eq("id", characterId);
        if (updateError) {
            console.error({ updateError });
            return fail(500, { message: updateError.message || "Something went wrong." }, { src: "saveColumn" });
        }
        
        return {};
    },
    saveLanguages: async ({ request, locals: { supabase, getProfile } }) => {
        const formData = await request.formData();
        const characterId = formData.get("character_id");
        if (!verifyEditPermission(supabase, getProfile, characterId)) {
            return fail(403, { message: "Forbidden" }, { src: "saveLanguages" });
        }

        const languagesIds = JSON.parse(formData.get("languages"))
            .map((language) => language.id);
        const insertData = languagesIds.map((languageId) => ({
            character: characterId,
            language: languageId,
        }));

        await supabase.from("character_languages")
            .delete()
            .eq("character", characterId);
        
        const { error } = await supabase.from("character_languages")
            .insert(insertData);
        if (error) {
            console.error({ error });
            return fail(500, { message: error.message || "Something went wrong." }, { src: "saveLanguages" });
        }
        
        return {};
    },
    saveNotes: async ({ request, locals: { supabase, getProfile } }) => {
        const formData = await request.formData();
        const characterId = formData.get("character_id");
        if (!verifyEditPermission(supabase, getProfile, characterId)) {
            return fail(403, { message: "Forbidden" }, { src: "saveNotes" });
        }

        const { error: updateError } = await supabase.from("characters")
            .update({ notes: JSON.parse(formData.get("notes")) })
            .eq("id", characterId);
        if (updateError) {
            console.error({ updateError });
            return fail(500, { message: updateError.message || "Something went wrong." }, { src: "saveNotes" });
        }
        
        return {};
    },
    saveSkill: async ({ request, locals: { supabase, getProfile } }) => {
        const formData = await request.formData();
        const characterId = formData.get("character_id");
        if (!verifyEditPermission(supabase, getProfile, characterId)) {
            return fail(403, { message: "Forbidden" }, { src: "saveLanguages" });
        }

        const { data: prevCharacter, error: prevCharacterError } = await supabase.from("characters")
            .select("character_skills")
            .eq("id", characterId)
            .single();
        if (prevCharacterError) {
            console.error({ prevCharacterError });
            return fail(500, { message: prevCharacterError.message || "Something went wrong." }, { src: "saveSkill" });
        }

        let skills = prevCharacter.character_skills ?? BASE_SKILLS;
        const soughtSkill = formData.get("skillName");
        const i = skills.findIndex((skill) => skill.skillName === soughtSkill);
        if (i === -1) {
            return fail(500, { message: "Something went wrong." }, { src: "saveSkill" });
        }
        if (soughtSkill === "GUNS") {
            skills[i].rank = JSON.parse(formData.get("newRank"));
        } else {
            skills[i].rank = parseInt(formData.get("newRank"));
        }
        const { error: updateError } = await supabase.from("characters")
            .update({ character_skills: skills })
            .eq("id", characterId);
        if (updateError) {
            console.error({ updateError });
            return fail(500, { message: updateError.message || "Something went wrong." }, { src: "saveSkill" });
        }
        
        return {};
    },
};
