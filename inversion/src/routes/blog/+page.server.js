
export const load = async ({ locals: { supabase } }) => {
    const { data, error } = await supabase.from("blog_entries")
        .select("id, title, author_label, created_at, tags, content")
        .order("created_at", { ascending: false });
    if (error) {
        console.error({ error });
        return { blogs: [] };
    }

    return {
        blogs: data
    };
}
