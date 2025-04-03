import { error, fail } from "@sveltejs/kit";
import { getProfileOrNull } from "$lib/server/serverUtils";
import { ADMIN_AUTH } from "$lib/constants";

export const load = async ({ locals: { supabase } }) => {
    const { data: allCampaigns, error } = await supabase.from("campaigns").select("*");
    if (error) {
        console.error({ error });
        return fail(500, { message: error.message || "Something went wrong." });
    }
    return { allCampaigns };
}

export const actions = {
    deleteCampaign: async ({ request, locals: { getSession, supabase, getProfile } }) => {
        const formData = await request.formData();
        const profile = await getProfile();
        const campaignId = parseInt(formData.get("campaign_id"));
        if (!profile || !campaignId) {
            throw error(400, "Bad Request");
        }

        if (profile.privilege < ADMIN_AUTH) {
            const { data: campaign, error } = await supabase.from("campaigns").select("creator").eq("id", campaignId);
            if (error) {
                console.error({ error });
                return fail(500, { message: error.message || "Something went wrong.", src: "editCampaign" });
            }
            if (campaign.creator !== profile.id) {
                throw error(403, "Forbidden");
            }
        }
        
        const { error } = await supabase.from("campaigns").delete()
            .eq("id", campaignId);
        if (error) {
            console.error({ error });
            return fail(500, { message: error.message || "Something went wrong.", src: "editCampaign" });
        }
        return {};
    },
    deletePasscode: async ({ request, locals: { getSession, supabase, getProfile } }) => {
        const formData = await request.formData();
        const profile = await getProfile();
        const passcodeToDelete = formData.get("passcodeToDelete");
        if (!profile || !passcodeToDelete) {
            throw error(400, "Bad Request");
        }

        const { error } = await supabase.from("profiles").update({
            passcodes: profile.passcodes.filter(passcode => passcode !== passcodeToDelete)
        }).eq("id", profile.id);
        if (error) {
            console.error({ error });
            return fail(500, { message: error.message || "Something went wrong.", src: "newPasscode" });
        }
        return {};
    },
    editCampaign: async ({ request, locals: { getSession, supabase, getProfile } }) => {
        const formData = await request.formData();
        const profile = await getProfile();
        if (!profile || profile.privilege < 1) {
            throw error(403, "Forbidden");
        }

        const campaignId = parseInt(formData.get("campaign_id"));
        if (profile.privilege < ADMIN_AUTH) {
            const { data: campaign, error } = await supabase.from("campaigns").select("creator").eq("id", campaignId);
            if (error) {
                console.error({ error });
                return fail(500, { message: error.message || "Something went wrong.", src: "editCampaign" });
            }
            if (campaign.creator !== profile.id) {
                throw error(403, "Forbidden");
            }
        }

        // Make sure title is unique by appending a number on the end if needed
        let workingTitle = formData.get("campaign_title");
        let { data: dupTitles, error: dupError } = await supabase.from("campaigns")
            .select("id")
            .eq("campaign_title", workingTitle)
            .neq("id", campaignId);
        let extraTitleNum = 1;
        while (!dupError && dupTitles.length > 0) {
            extraTitleNum++;
            let { data: dbDupTitles, error: dbDupError } = await supabase.from("campaigns")
                .select("id")
                .eq("campaign_title", `${workingTitle} ${extraTitleNum}`)
                .neq("id", campaignId);
            dupTitles = dbDupTitles;
            dupError = dbDupError;
        }
        if (dupError) {
            console.error({ dupError });
            return fail(500, { message: dupError.message || "Something went wrong.", src: "editCampaign" });
        }
        workingTitle = `${workingTitle}${extraTitleNum > 1 ? ` ${extraTitleNum}` : ""}`;
        
        const { error } = await supabase.from("campaigns").update({
            campaign_title: workingTitle,
            view_passcode: formData.get("view_passcode"),
            participate_passcode: formData.get("participate_passcode"),
            description: JSON.parse(formData.get("description")),
            updated_at: new Date(),
        }).eq("id", campaignId);
        if (error) {
            console.error({ error });
            return fail(500, { message: error.message || "Something went wrong.", src: "editCampaign" });
        }
        return {};
    },
    newCampaign: async ({ request, locals: { getSession, supabase, getProfile } }) => {
        const formData = await request.formData();
        const profile = await getProfile();
        if (!profile || profile.privilege < 1) {
            throw error(403, "Forbidden");
        }

        // Make sure title is unique by appending a number on the end if needed
        let workingTitle = formData.get("campaign_title");
        let { data: dupTitles, error: dupError } = await supabase.from("campaigns")
            .select("id")
            .eq("campaign_title", workingTitle);
        let extraTitleNum = 1;
        while (!dupError && dupTitles.length > 0) {
            extraTitleNum++;
            let { data: dbDupTitles, error: dbDupError } = await supabase.from("campaigns")
                .select("id")
                .eq("campaign_title", `${workingTitle} ${extraTitleNum}`);
            dupTitles = dbDupTitles;
            dupError = dbDupError;
        }
        if (dupError) {
            console.error({ dupError });
            return fail(500, { message: dupError.message || "Something went wrong.", src: "editCampaign" });
        }
        workingTitle = `${workingTitle}${extraTitleNum > 1 ? ` ${extraTitleNum}` : ""}`;

        const { error } = await supabase.from("campaigns").insert({
            campaign_title: workingTitle,
            creator: profile.id,
            view_passcode: formData.get("view_passcode"),
            participate_passcode: formData.get("participate_passcode"),
            description: JSON.parse(formData.get("description")),
        });
        if (error) {
            console.error({ error });
            return fail(500, { message: error.message || "Something went wrong.", src: "newCampaign" });
        }
        return {};
    },
    newPasscode: async ({ request, locals: { getSession, supabase, getProfile } }) => {
        const formData = await request.formData();
        const profile = await getProfile();
        const newPasscode = formData.get("newPasscode");
        if (!profile || !newPasscode) {
            throw new Error("Bad Request");
        }

        if (profile.passcodes.includes(newPasscode)) {
            return {};
        }

        const { error } = await supabase.from("profiles").update({
            passcodes: [...profile.passcodes, newPasscode]
        }).eq("id", profile.id);
        if (error) {
            console.error({ error });
            return fail(500, { message: error.message || "Something went wrong.", src: "newPasscode" });
        }
        return {};
    },
    suppressCampaign: async ({ request, locals: { getSession, supabase, getProfile } }) => {
        const formData = await request.formData();
        const profile = await getProfile();
        const campaignId = parseInt(formData.get("campaignId"));
        if (!profile || !campaignId) {
            throw error(400, "Bad Request");
        }
        if (profile.suppressed_campaigns.includes(campaignId)) {
            return {};
        }

        const { error } = await supabase.from("profiles").update({
            suppressed_campaigns: [...profile.suppressed_campaigns, campaignId]
        }).eq("id", profile.id);
        if (error) {
            console.error({ error });
            return fail(500, { message: error.message || "Something went wrong.", src: "suppressCampaign" });
        }
        return {};
    },
    unsuppressCampaign: async ({ request, locals: { getSession, supabase, getProfile } }) => {
        const formData = await request.formData();
        const profile = await getProfile();
        const campaignId = parseInt(formData.get("campaignId"));
        if (!profile || !campaignId) {
            throw error(400, "Bad Request");
        }
        if (!profile.suppressed_campaigns.includes(campaignId)) {
            return {};
        }

        const { error } = await supabase.from("profiles").update({
            suppressed_campaigns: profile.suppressed_campaigns.filter(campaign => campaign !== campaignId)
        }).eq("id", profile.id);
        if (error) {
            console.error({ error });
            return fail(500, { message: error.message || "Something went wrong.", src: "unsuppressCampaign" });
        }
        return {};
    }
}
