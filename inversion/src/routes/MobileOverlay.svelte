<script>
    import { fade, slide } from "svelte/transition";
    import { Collapsible } from "bits-ui";
    import { modes } from "$lib/store.svelte.js";
    import HamburgerIcon from "$lib/components/icons/HamburgerIcon.svelte";
    import LogoHomeLink from "$lib/components/layout/LogoHomeLink.svelte";
	import ToC from "$lib/components/layout/ToC.svelte";

    // Track the header's height for CSS
    let overlayHeaderHeight = $state();
    $effect(() => {
        document.querySelector(":root").style.setProperty("--overlayHeaderHeight", `${overlayHeaderHeight}px`);
    });

    // Track whether the overlay is open in global state
    let overlayOpen = $state(false);
    const closeFct = () => overlayOpen = false;
    $effect(() => {
        modes.setMobileOverlayOpen(overlayOpen);
    });
</script>

<Collapsible.Root bind:open={overlayOpen}>
    {#snippet child({ props })}
        <article {...props} class={`${overlayOpen ? "open" : ""}`}>
            <header bind:clientHeight={overlayHeaderHeight}>
                <Collapsible.Trigger>
                    {#snippet child({ props })}
                        <button {...props}>
                            <HamburgerIcon size="3rem" />
                        </button>
                    {/snippet}
                </Collapsible.Trigger>
                <LogoHomeLink />
            </header>
            <div id="overlayPanelVisual" out:fade={{ duration: 300}}></div>
            <Collapsible.Content forceMount>
                {#snippet child({ props, open })}
                    {#if open}
                        <nav {...props} in:slide={{ delay: 100, duration: 300 }}>
                            <ToC {closeFct} />
                        </nav>
                    {/if}
                {/snippet}
            </Collapsible.Content>
        </article>        
    {/snippet}
</Collapsible.Root>

<style>
    article {
        position: absolute;
        top: 0;
        z-index: 100;
        width: 100%;
        display: flex;
        flex-direction: column;

        &.open {
            height: 100%;
            
            & div#overlayPanelVisual {
                height: calc(100% - var(--overlayHeaderHeight));
            }
            & > nav {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
        }

        & header {
            position: relative;

            & button {
                position: absolute;
                top: 50%;
                left: 1.6rem;
                transform: translateY(-50%);
                width: 3rem;
                height: 3rem;
            }
        }
        & div#overlayPanelVisual {
            position: absolute;
            top: var(--overlayHeaderHeight);
            width: 100%;
            height: 0;
            background-color: var(--consistentDark);
            background-image: url("/bgs/transParchment.png");
            background-position: center;
            background-size: cover;
            transition: height 0.3s linear;
        }
        & nav {
            z-index: 1;
        }
    }
</style>
