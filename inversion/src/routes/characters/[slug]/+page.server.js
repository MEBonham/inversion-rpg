
export const load = async ({ locals: { supabase }, params }) => {
    const { data: character, error: characterError } = await supabase.from("characters")
        .select("*")
        .eq("slug", params.slug)
        .single();
    if (characterError) {
        console.error({ characterError });
        return fail(500, { message: characterError.message || "Something went wrong." });
    }
    return { character };
}
