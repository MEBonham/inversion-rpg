<script>
    import { onMount } from "svelte";
    import { invalidate } from "$app/navigation";

    import { ScrollArea } from "bits-ui";

    import "$lib/styles/reset.css";
    import "$lib/styles/main.css";
    import "$lib/styles/bits.css";
    import { MOBILE_WIDTH } from "$lib/constants";
    import { modes } from "$lib/store.svelte.js";
    import Sidebar from "./Sidebar.svelte";
    import MobileOverlay from "./MobileOverlay.svelte";
    import AppFooter from "./AppFooter.svelte";

    let { children, data } = $props();
    const supabase = $derived(data.supabase);
    const session = $derived(data.session);
    onMount(async () => {
        const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
            if (newSession?.expires_at !== session?.expires_at) {
                invalidate("supabase:auth");
            }
        });
        return () => data.subscription.unsubscribe();
    });
    
    let screenWidth = $state();
    let mobileView = $derived(screenWidth <= MOBILE_WIDTH);
    $effect(() => {
        modes.setIsOnMobile(mobileView);
    });
</script>

<svelte:head>
    <title>Inversion RPG</title>
</svelte:head>

<svelte:window bind:innerWidth={screenWidth} />

<div id="envelope" class={mobileView ? "mobileMode" : ""}>
    {#if modes.isOnMobile}
        <MobileOverlay />
    {:else}
        <Sidebar />
    {/if}
    <ScrollArea.Root class="main">
        <ScrollArea.Viewport>
            {@render children()}
            <AppFooter />
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
    </ScrollArea.Root>
</div>

<style>
    :global(body) {
        width: 100dvw;
        font-size: 2.0rem;
        line-height: 1.4;

        & h1 {
            font-family: "Girassol", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            color: var(--headerColor);
        }
        & div#envelope {
            position: relative;
            width: calc(100% - 1.4rem);
            height: calc(100dvh - 1.4rem);
            margin: 0.7rem;
            border-radius: 1.8rem;
            box-shadow: 0 0 1.0rem var(--boldTorquoise);
            overflow: hidden;
            display: flex;
            flex-direction: row;

            &.mobileMode {
                flex-direction: column;
            }
        }
    }
</style>
