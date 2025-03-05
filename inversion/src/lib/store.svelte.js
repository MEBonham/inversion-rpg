const modeManager = () => {
    let isOnMobile = $state(true);
    const setIsOnMobile = (newMobileStatus) => {
        isOnMobile = newMobileStatus;
    }
    let mobileOverlayOpen = $state(false);
    const setMobileOverlayOpen = (newMobileOverlayOpen) => {
        mobileOverlayOpen = newMobileOverlayOpen;
    }
    const toggleMobileOverlayOpen = () => {
        mobileOverlayOpen = !mobileOverlayOpen;
    }

    return {
        get isOnMobile() {
            return isOnMobile;
        },
        setIsOnMobile,
        get mobileOverlayOpen() {
            return mobileOverlayOpen;
        },
        setMobileOverlayOpen,
        toggleMobileOverlayOpen
    };
}
export const modes = modeManager();
