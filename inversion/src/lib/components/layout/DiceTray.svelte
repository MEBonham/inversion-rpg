<script>
    import { Popover } from "bits-ui";
    import XIcon from "$lib/components/icons/XIcon.svelte";
</script>

<Popover.Content trapFocus={false} interactOutsideBehavior="ignore" customAnchor="#appSidebar">
    {#snippet child({ props })}
        <div {...props} id="diceSidebar">
            <Popover.Close>
                {#snippet child({ props })}
                    <button {...props} id="diceSidebarCloseButton">
                        <XIcon size="2.0rem" />
                    </button>
                {/snippet}
            </Popover.Close>
            <h2>Dice Roller</h2>
        </div>
    {/snippet}
</Popover.Content>

<style>
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
        background-size: cover;
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
        & :global(button#diceSidebarCloseButton) {
            position: absolute;
            top: 1.2rem;
            right: 1.2rem;
            height: 2.0rem;
            color: var(--consistentLight);
            font-size: 2.0rem;
        }
    }
</style>
