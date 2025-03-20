
export const load = async ({ locals: { getSession, supabase, getProfile }, cookies }) => {
    const session = await getSession();
    const profile = await getProfile();
    return { session, profile, cookies: cookies.getAll() };
}
