<script>
    import { Dialog } from "bits-ui";
    import Button from "$lib/components/Button.svelte";
    import BufferDot from "$lib/components/BufferDot.svelte";
    import NormalDialog from "$lib/components/NormalDialog.svelte";
    import NewBackgroundForm from "./NewBackgroundForm.svelte";
    import NewLanguagesForm from "./NewLanguagesForm.svelte";

    let dialogsOpen = $state({
        languages: false,
        backgrounds: false,
        ancestries: false,
    });
    const closeDialog = (whichDialog) => dialogsOpen[whichDialog] = false;
</script>

<section>
    <header>
        <h2>Add to Library</h2>
    </header>
    <Dialog.Root bind:open={dialogsOpen.languages}>
        <Dialog.Trigger>
            {#snippet child({ props })}
                <Button {...props}>Languages</Button>
            {/snippet}
        </Dialog.Trigger>
        <NormalDialog title="New Language">
            <NewLanguagesForm action="?/newLanguage" closeDialog={() => closeDialog("languages")} />
        </NormalDialog>
    </Dialog.Root>
    <BufferDot />
    <Dialog.Root bind:open={dialogsOpen.backgrounds}>
        <Dialog.Trigger>
            {#snippet child({ props })}
                <Button {...props}>Backgrounds</Button>
            {/snippet}
        </Dialog.Trigger>
        <NormalDialog title="New Background">
            <NewBackgroundForm action="?/newBackground" closeDialog={() => closeDialog("backgrounds")} />
        </NormalDialog>
    </Dialog.Root>
    <BufferDot />
    <Dialog.Root bind:open={dialogsOpen.ancestries}>
        <Dialog.Trigger>
            {#snippet child({ props })}
                <Button {...props}>Ancestries</Button>
            {/snippet}
        </Dialog.Trigger>
    </Dialog.Root>
</section>

<style>
    section {
        padding: 0.4rem 1.6rem 1.0rem;
    }
</style>
