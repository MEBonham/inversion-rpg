<script>
    import { Dialog, ScrollArea } from "bits-ui";
	import XIcon from "./icons/XIcon.svelte";

    let { title, children, description="" } = $props();
    let dialogTotalHeight = $state();
    let dialogHeaderHeight = $state();
    $effect(() => {
        document.querySelector(':root').style.setProperty("--dialogHeaderHeight", `${dialogHeaderHeight}px`);
        document.querySelector(':root').style.setProperty("--dialogTotalHeight", `${dialogTotalHeight}px`);
    });
</script>

<Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
        {#snippet child({ props })}
            <div {...props} bind:clientHeight={dialogTotalHeight}>
                <header bind:clientHeight={dialogHeaderHeight}>
                    <Dialog.Title>
                        {#snippet child({ props })}
                            <h2 {...props}>{title}</h2>
                        {/snippet}
                    </Dialog.Title>
                    {#if description}
                        <Dialog.Description>
                            {#snippet child({ props })}
                                <p {...props}>{description}</p>
                            {/snippet}
                        </Dialog.Description>
                    {/if}
                    <Dialog.Close>
                        {#snippet child({ props })}
                            <button {...props} class="closeDialog">
                                <XIcon size="2rem" />
                            </button>
                        {/snippet}
                    </Dialog.Close>
                </header>
                <main>
                    <ScrollArea.Root>
                        <ScrollArea.Viewport>
                            {@render children()}
                        </ScrollArea.Viewport>
                        <ScrollArea.Scrollbar orientation="vertical">
                            <ScrollArea.Thumb />
                        </ScrollArea.Scrollbar>
                    </ScrollArea.Root>
                </main>
            </div>
        {/snippet}
    </Dialog.Content>
</Dialog.Portal>

<style>
    button.closeDialog {
        width: 2.0rem;
        height: 2.0rem;
    }

    header {
        padding: 0 0 0.8rem;
        border-bottom: 1px solid var(--invertParchment);

        & h2 {
            font-family: "Girassol";
            font-size: 2.4rem;
            color: var(--boldTorquoise);
        }
    }
    main {
        & :global(div[data-scroll-area-root]) {
            height: calc(var(--dialogTotalHeight) - var(--dialogHeaderHeight) - 1.6rem);
            padding-bottom: 2.0rem;
        }
    }
</style>
