

export const load = async ({ locals: { supabase } }) => {
    const { data, error } = await supabase.from("rules_chapters")
        .select("id, title, chapter_num")
        .order("chapter_num", { ascending: true });
    if (error) {
        console.error({ error });
    }

    return {
        chapters: error ? [] : data
    };
}


