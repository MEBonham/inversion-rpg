
export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};

export const handleSubmit = (loadingRef, cleanupFct=null) => {
    loadingRef = true;
    return async ({ update }) => {
        await update();
        if (cleanupFct) {
            cleanupFct();
        }
        loadingRef = false;
    };
}

export const sleep = (delaySeconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delaySeconds * 1000);
    });
}
