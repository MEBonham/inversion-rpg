

export const load = async ({ locals: { supabase }, params }) => {
    const { data: chapters, error: chapterError } = await supabase.from("rules_chapters")
        .select("id, title, chapter_num");
    if (chapterError) {
        console.error({ chapterError });
        return fail(500, { message: chapterError.message || "Something went wrong." });
    }

    const { data: rulesSummaries, error: rulesSummariesError } = await supabase.from("rules_summaries")
        .select("id, title, created_at, chapter_num, section_num, content, is_public")
        .order("section_num", { ascending: true })
        .eq("chapter_num", parseInt(params.chapterNum))
        .eq("is_public", true);
    if (rulesSummariesError) {
        console.error({ rulesSummariesError });
    }
    
    return {
        chapters,
        activeChapter: chapters.find((chapter) => chapter.chapter_num === parseInt(params.chapterNum)),
        rulesSummaries,
        chapterNum: parseInt(params.chapterNum),
    };
}
