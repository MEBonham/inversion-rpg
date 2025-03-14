
export const load = async ({ locals: { safeGetSession, supabase }, cookies }) => {
    const { session, user } = await safeGetSession();

    return {
        session,
        profile: user,
        cookies: cookies.getAll(),
    };
}
