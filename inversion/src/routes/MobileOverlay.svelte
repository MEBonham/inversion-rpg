<script>
    import { Collapsible } from "bits-ui";
    import { modes } from "$lib/store.svelte.js";
	import HamburgerIcon from "$lib/components/icons/HamburgerIcon.svelte";
    import HomeLogoLink from "./HomeLogoLink.svelte";
    import ToC from "./ToC.svelte";

    let overlayOpen = $state(false);
    const closeFct = () => overlayOpen = false;
    let overlayHeaderHeight = $state();
    $effect(() => {
        modes.setMobileOverlayOpen(overlayOpen);
    });
    $effect(() => {
        document.querySelector(':root').style.setProperty("--overlayHeaderHeight", `${overlayHeaderHeight}px`);
    });
</script>

<Collapsible.Root class="mainOverlay" bind:open={overlayOpen}>
    <header bind:clientHeight={overlayHeaderHeight}>
        <Collapsible.Trigger class="clickable">
            {#snippet child({ props })}
                <button {...props}>
                    <HamburgerIcon size="3rem" />
                </button>    
            {/snippet}
        </Collapsible.Trigger>
        <HomeLogoLink />
    </header>
    <Collapsible.Content>
        {#snippet child({ props })}
            <div {...props}>
                <ToC {closeFct} />
            </div>
        {/snippet}
    </Collapsible.Content>
</Collapsible.Root>

<style>
    header {
        position: relative;

        & button {
            position: absolute;
            top: 50%;
            left: 1.6rem;
            transform: translateY(-50%);
        }
    }
</style>
