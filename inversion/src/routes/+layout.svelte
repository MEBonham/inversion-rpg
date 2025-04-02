<script>
    import { invalidate } from "$app/navigation";
    import { fade } from "svelte/transition";

    import { ScrollArea } from "bits-ui";

    import "$lib/styles/reset.css";
    import "$lib/styles/main.css";
    import "$lib/styles/bits.css";
    import { sleep } from "$lib/utils";
    import { MOBILE_WIDTH } from "$lib/constants";
    import { modes } from "$lib/store.svelte.js";

    import Sidebar from "./Sidebar.svelte";
    import MobileOverlay from "./MobileOverlay.svelte";
    import AppFooter from "./AppFooter.svelte";

    let { children, data } = $props();

    let { supabase, session } = $state(data);
    $effect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, _session) => {
            if (_session?.expires_at !== session?.expires_at) {
                invalidate("supabase:auth");
            }
        })
        return () => subscription.unsubscribe();
    });

    // Keep track in global state whether the app is on mobile
    let screenWidth = $state();
    let mobileVersion = $derived(screenWidth <= MOBILE_WIDTH);
    $effect(() => {
        modes.setIsOnMobile(mobileVersion);
    });

    // Hide the Loading overlay once the refresh "flash" is done
    let showLoadingOverlay = $state(true);
    $effect(() => {
        showLoadingOverlay = false;
    });

    // Sync Dark Mode status with localStorage
    $effect(() => {
        if (window.localStorage.getItem("inversion-dark-mode") === null) {
            // Used to default to browser preference setting, but Noon wants light to be the default
            // window.localStorage.setItem("inversion-dark-mode", window.matchMedia("(prefers-color-scheme: dark)").matches ? "true" : "false");
            window.localStorage.setItem("inversion-dark-mode", "false");
        }
        if (window.localStorage.getItem("inversion-dark-mode") === "true") {
            document.querySelector(':root').classList.add("darkMode");
        }
    });
</script>

<svelte:head>
    <title>Inversion RPG</title>
</svelte:head>

<svelte:window bind:innerWidth={screenWidth} />

<div id="envelope" class:mobileMode={mobileVersion}>
    {#if showLoadingOverlay}
        <div id="loadingScreen" out:fade={{ delay: 200, duration: 500 }}></div>
    {/if}
    {#if mobileVersion}
        <MobileOverlay />
    {:else}
        <Sidebar />
    {/if}
    <ScrollArea.Root>
        {#snippet child({ ...props })}
            <main {...props} class={`${mobileVersion ? "mobileMode" : "desktopMode"}`}>
                <img src="/bgs/Left%20Frills.png" alt="frill" class="left" />
                <img src="/bgs/Right%20Frills.png" alt="frill" class="right" />
                <img src="/bgs/Background%20Gear%20Left.png" alt="rivet" class="cornerLeft" />
                <img src="/bgs/Background%20Gear%20Right.png" alt="rivet" class="cornerRight" />
                <img src="/bgs/Inverted%20Left%20Frills.png" alt="frill" class="left darkMode" />
                <img src="/bgs/Inverted%20Right%20Frills.png" alt="frill" class="right darkMode" />
                <img src="/bgs/Inverted%20Background%20Gear%20Left.png" alt="rivet" class="cornerLeft darkMode" />
                <img src="/bgs/Inverted%20Background%20Gear%20Right.png" alt="rivet" class="cornerRight darkMode" />
                <ScrollArea.Viewport class="pageViewport">
                    {@render children()}
                    <AppFooter />
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar orientation="vertical">
                    <ScrollArea.Thumb />
                </ScrollArea.Scrollbar>
            </main>
        {/snippet}
    </ScrollArea.Root>
</div>

<style>
    main {
        position: relative;
        flex-grow: 1;

        &.mobileMode {
            width: 100%;
            height: calc(100% - var(--overlayHeaderHeight));
            margin-top: var(--overlayHeaderHeight);
        }
        &.desktopMode {
            height: 100%;
        }
    }

    img {
        position: absolute;
        z-index: var(--lightFrillZ);

        &.darkMode {
            z-index: var(--darkFrillZ);
        }
    }
    img.left {
        bottom: -0.4rem;
        left: 0.8rem;
        height: calc(100% - 4.2rem);
    }
    img.right {
        bottom: -0.4rem;
        right: 0.8rem;
        height: calc(100% - 4.5rem);
    }
    img.cornerLeft {
        top: 0.4rem;
        left: 0.4rem;
        height: 6.0rem;
    }
    img.cornerRight {
        top: 0.4rem;
        right: 0.4rem;
        height: 6.0rem;
    }

    :global(body) {
        width: 100dvw;
        font-size: 1.8rem;
        line-height: 1.4;
        color: var(--invertParchment);

        & div#envelope {
            position: relative;
            width: calc(100% - 1.4rem);
            height: calc(100dvh - 1.4rem);
            margin: 0.7rem;
            border-radius: 1.8rem;
            box-shadow: 0 0 1.0rem var(--boldTorquoise);
            overflow: hidden;
            display: flex;
            
            &.mobileMode {
                flex-direction: column;
            }

            & div#loadingScreen {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--parchment);
                background-image: url("/Title Logo.png");
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                z-index: 1000;
            }
        }

        & h1 {
            font-family: "Girassol", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            color: var(--headerColor);
        }
    }
</style>
