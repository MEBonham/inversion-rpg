<script>
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
            <Collapsible.Content>
                {#snippet child({ props })}
                    <div {...props}>
                        <ToC />
                    </div>
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
        background-color: var(--consistentDark);
        background-image: url("/bgs/transParchment.png");
        background-position: center;
        background-size: cover;
        display: flex;
        flex-direction: column;

        &.open {
            height: 100%;
            
            & > div {
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
    }
</style>
