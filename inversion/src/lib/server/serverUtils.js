
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
