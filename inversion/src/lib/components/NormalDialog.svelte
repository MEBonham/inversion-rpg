<script>
    import { Dialog, ScrollArea } from "bits-ui";
	import XIcon from "./icons/XIcon.svelte";

    let { title, children, description="" } = $props();
</script>

<Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
        <header>
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
    }
</style>
