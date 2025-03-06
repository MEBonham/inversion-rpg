<script>
    import { page } from "$app/stores";
    import { Popover } from "bits-ui";
    import { modes } from "$lib/store.svelte.js";
    import XIcon from "$lib/components/icons/XIcon.svelte";

    let { closeFct = () => {} } = $props();

    const { data } = $page;
    let profile = $derived(data.profile);
    let diceRollerSidebarIsOpen = $state(false);
    $effect(() => {
        modes.setDiceRollerMode(diceRollerSidebarIsOpen);
    });
</script>

<nav class={modes.isOnMobile && modes.mobileOverlayOpen ? "open" : ""}>
    <ul>
        <li>
            <a href="/campaigns" onclick={closeFct}>Campaigns</a>
        </li>
        <li>
            <a href="/characters" onclick={closeFct}>Characters</a>
        </li>
        {#if modes.isOnMobile}
            <li>
                <button onclick={() => {
                    modes.setDiceRollerMode(!modes.diceRollerMode);
                    closeFct();
                }}>Play Inversion</button>
            </li>
        {:else}
            <Popover.Root bind:open={diceRollerSidebarIsOpen}>
                <li>
                    <Popover.Trigger>
                        {#snippet child({ props })}
                            <button {...props}>Play Inversion</button>
                        {/snippet}
                    </Popover.Trigger>
                    <Popover.Content trapFocus={false} interactOutsideBehavior="ignore" customAnchor="#appSidebar">
                        {#snippet child({ props })}
                            <div {...props} id="diceSidebar">
                                <Popover.Close>
                                    {#snippet child({ props })}
                                        <button {...props} id="closeDiceSidebar">
                                            <XIcon size="2rem" />
                                        </button>
                                    {/snippet}
                                </Popover.Close>
                                <h2>Dice Roller</h2>
                            </div>
                        {/snippet}
                    </Popover.Content>
                </li>
            </Popover.Root>
        {/if}
        {#if profile && profile.privilege > 0}
            <li>
                <a href="/settings" onclick={closeFct}>Account & Settings</a>
            </li>
        {:else}
            <li>
                <a href="/login" onclick={closeFct}>Login/Register</a>
            </li>
        {/if}
    </ul>
</nav>

<style>
    nav {
        width: 100%;
        flex-grow: 1;
        padding: 1.4rem 3.4rem;
        background-color: var(--consistentDark);
        background-image: url("/bgs/transParchment.png");
        background-position: center;
        display: flex;
        justify-content: center;
        color: var(--consistentLight);
        font-size: 2.0rem;

        &.open {
            width: 100%;
            height: calc(100% - var(--overlayHeaderHeight));
            position: absolute;
            bottom: 0;
        }

        ul {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
        }
    }
    div#diceSidebar {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 1.8rem 0 0 1.8rem;
        background-color: var(--consistentDark);
        background-image: url("/bgs/transParchment.png");
        background-position: center;
        box-shadow: 0 0 1.0rem var(--consistentLight) inset;
        padding: 1.4rem 2.6rem 0.4rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        & h2 {
            font-size: 2.8rem;
            font-family: "Postamt", sans-serif;
            color: var(--boldTorquoise);
        }
        & :global(#closeDiceSidebar) {
            position: absolute;
            top: 1.2rem;
            right: 1.2rem;
            height: 2.0rem;
            color: var(--parchment);
        }
    }
</style>
