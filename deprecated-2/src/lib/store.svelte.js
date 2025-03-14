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

    let diceRollerMode = $state(false);
    const setDiceRollerMode = (newDiceRollerMode) => {
        diceRollerMode = newDiceRollerMode;
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
        toggleMobileOverlayOpen,
        get diceRollerMode() {
            return diceRollerMode;
        },
        setDiceRollerMode,
    };
}
export const modes = modeManager();
