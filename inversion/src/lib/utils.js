
export const blobToBase64 = async (blob, options = {}) => {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return `data:${options.mimeType || blob.type};base64,` + buffer.toString("base64");
}

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

export const handleSubmit = (loadingRef) => {
    loadingRef = true;
    return async ({ update }) => {
        await update();
        loadingRef = false;
    };
}

export const sleep = (delaySeconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delaySeconds * 1000);
    });
}
