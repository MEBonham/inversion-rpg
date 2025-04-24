import { error, fail, redirect } from "@sveltejs/kit";
import { ADMIN_AUTH } from "$lib/constants";
import { clamp } from "$lib/utils";

export const load = async ({ locals: { supabase, getProfile } }) => {
    const profile = await getProfile();
    if (!profile || profile.auth_num < ADMIN_AUTH) {
        throw error(403, "Forbidden");
    }

    // Load blog entries written by the admin, or all for a super admin
    const { data: blogEntries, error: blogEntriesError } = await supabase.from("blog_entries")
        .select("id, title, created_at, tags, content, is_public")
        .order("created_at", { ascending: false });
    if (blogEntriesError) {
        console.error({ blogEntriesError });
        return fail(500, { message: blogEntriesError.message || "Something went wrong." });
    }

    // Load chapters info
    const { data: chapters, error: chaptersError } = await supabase.from("rules_chapters")
        .select("id, title, chapter_num");

    // Load sections info
    const { data: rulesSummaries, error: rulesSummariesError } = await supabase.from("rules_summaries")
        .select("id, title, created_at, chapter_num, section_num, content");

    return {
        blogEntries: blogEntries.filter((entry) => entry.author_id === profile.id || profile.auth_num > ADMIN_AUTH),
        chapters: chapters.sort((a, b) => a.chapter_num - b.chapter_num),
        rulesSummaries: rulesSummaries.sort((a, b) => a.chapter_num - b.chapter_num || a.section_num - b.section_num),
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
                is_public: formData.get("public") === "true",
            }).eq("id", editingId);
            if (error) {
                console.error({ error });
                return fail(500, { message: error.message || "Something went wrong." }, { src: "blogPost" });
            }
        } else {
            const { error } = await supabase.from("blog_entries").insert({
                title: formData.get("title"),
                author_id: profile.id,
                author_label: profile.username || "Admin",
                tags: formData.get("tags").split(";").map((tag) => tag.trim()),
                content: JSON.parse(formData.get("content")),
                is_public: formData.get("public") === "true",
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
    rulesSectionPost: async ({ request, locals: { supabase, getProfile } }) => {
        const formData = await request.formData();
        const profile = await getProfile();
        if (!profile || profile.auth_num < ADMIN_AUTH) {
            throw error(403, "Forbidden");
        }

        // Load chapters info
        const { data: chapters, error: chaptersError } = await supabase.from("rules_chapters")
            .select("id, title, chapter_num");
        const chapterNum = clamp(parseInt(formData.get("chapterNum")), 1, chapters.length);

        const editingId = parseInt(formData.get("editingId"));
        if (editingId) {
            const { error } = await supabase.from("rules_summaries").update({
                title: formData.get("title"),
                chapter_num: chapterNum,
                section_num: parseInt(formData.get("sectionNum")),
                content: JSON.parse(formData.get("content")),
            }).eq("id", editingId);
            if (error) {
                console.error({ error });
                return fail(500, { message: error.message || "Something went wrong." }, { src: "rulesSectionPost" });
            }
        } else {
            const { error } = await supabase.from("rules_summaries").insert({
                title: formData.get("title"),
                chapter_num: chapterNum,
                section_num: parseInt(formData.get("sectionNum")),
                content: JSON.parse(formData.get("content")),
            });
            if (error) {
                console.error({ error });
                return fail(500, { message: error.message || "Something went wrong." }, { src: "rulesSectionPost" });
            }
        }
        throw redirect(307, `/rules/${chapterNum}`);
    },
    saveChapters: async ({ request, locals: { supabase, getProfile } }) => {
        const formData = await request.formData();
        const profile = await getProfile();
        if (!profile || profile.auth_num < ADMIN_AUTH) {
            throw error(403, "Forbidden");
        }

        const newChapters = JSON.parse(formData.get("chapters"));
        const promises = newChapters.map(async (chapter, i) => {
            const chapterObj = {
                chapter_num: -1 - i,
                title: chapter.title,
            };
            if (chapter.id % 1 === 0) {
                chapterObj.id = chapter.id;
            }
            const { error: chapterError } = await supabase.from("rules_chapters").upsert(
                chapterObj
            );
            if (chapterError) {
                console.error({ chapterError });
                return fail(500, { message: chapterError.message || "Something went wrong." }, { src: "saveChapters" });
            }
        });
        await Promise.all(promises);
        const { data: negativeChapterNums, error: findError } = await supabase.from("rules_chapters")
            .select("id, chapter_num, title")
            .lt("chapter_num", 0);
        if (findError) {
            console.error({ findError });
            return fail(500, { message: findError.message || "Something went wrong." }, { src: "saveChapters" });
        }
        const { error: flipError } = await supabase.from("rules_chapters")
            .upsert(negativeChapterNums.map((entry) => ({
                ...entry,
                chapter_num: (-1) * entry.chapter_num,
            })));
        if (flipError) {
            console.error({ flipError });
            return fail(500, { message: flipError.message || "Something went wrong." }, { src: "saveChapters" });
        }
        
        return {};
    },
};
