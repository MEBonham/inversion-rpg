<script>
    import { Dialog, Tabs } from "bits-ui";
    import Button from "$lib/components/Button.svelte";
    import BufferDot from "$lib/components/BufferDot.svelte";
    import NormalDialog from "$lib/components/NormalDialog.svelte";
    import NewActiveAbilityForm from "./NewActiveAbilityForm.svelte";
    import NewAncestryForm from "./NewAncestryForm.svelte";
    import NewBackgroundForm from "./NewBackgroundForm.svelte";
    import NewLanguagesForm from "./NewLanguagesForm.svelte";
    import NewItemForm from "./NewItemForm.svelte";

    let dialogsOpen = $state({
        languages: false,
        backgrounds: false,
        ancestries: false,
        activeAbilities: false,
        items: false,
    });
    const closeDialog = (whichDialog) => dialogsOpen[whichDialog] = false;
</script>

<Tabs.Content value="lib">
    {#snippet child({ props })}
        <section { ...props }>
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
                <NormalDialog title="New Ancestry">
                    <NewAncestryForm action="?/newAncestry" closeDialog={() => closeDialog("ancestries")} />
                </NormalDialog>
            </Dialog.Root>
            <BufferDot />
            <Dialog.Root bind:open={dialogsOpen.activeAbilities}>
                <Dialog.Trigger>
                    {#snippet child({ props })}
                        <Button {...props}>Active Abilities</Button>
                    {/snippet}
                </Dialog.Trigger>
                <NormalDialog title="New Active Ability">
                    <NewActiveAbilityForm action="?/newActiveAbility" closeDialog={() => closeDialog("activeAbilities")} />
                </NormalDialog>
            </Dialog.Root>
            <BufferDot />
            <Dialog.Root bind:open={dialogsOpen.items}>
                <Dialog.Trigger>
                    {#snippet child({ props })}
                        <Button {...props}>Items</Button>
                    {/snippet}
                </Dialog.Trigger>
                <NormalDialog title="New Item">
                    <NewItemForm action="?/newItem" closeDialog={() => closeDialog("items")} />
                </NormalDialog>
            </Dialog.Root>
        </section>
    {/snippet}
</Tabs.Content>

<style>
    section {
        padding: 0.4rem 1.6rem 1.0rem;
    }
</style>
