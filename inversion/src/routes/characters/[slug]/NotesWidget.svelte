<script>
    import { tick } from "svelte";
    import { page } from "$app/stores";
    import { ContextMenu, Dialog } from "bits-ui";
    import { handleSubmit, sleep } from "$lib/utils";
	import NormalDialog from "$lib/components/NormalDialog.svelte";
	import NormalForm from "$lib/components/NormalForm.svelte";
    import Button from "$lib/components/Button.svelte";
    import QuillEditor from "$lib/components/QuillEditor.svelte";

    let { hasEditPermission } = $props();
    let dbNotes = $derived($page.data.character.notes ?? {});
    let editedNotes = $state($page.data.character.notes ?? {});
    let dbFriendly = $derived(JSON.stringify(editedNotes));

    let editorQuillRef = $state();
    const bindToEditorQuill = (quillInstance) => {
        editorQuillRef = quillInstance;
    }
    let displayQuillRef = $state();
    const bindToDisplayQuill = (quillInstance) => {
        displayQuillRef = quillInstance;
    }
    let dialogIsOpen = $state(false);
    let hasSetContents = $state(false);
    $effect(async () => {
        if (!hasSetContents && editorQuillRef && dialogIsOpen) {
            await tick();
            editorQuillRef.setContents(dbNotes);
            hasSetContents = true;
        }
    });
    $effect(() => {
        if (displayQuillRef) {
            displayQuillRef.setContents(dbNotes);
            if (!dialogIsOpen) {
                editorQuillRef = null;
            }
        }
    });

    
    let loading = $state(false);
    const cleanupSubmit = async () => {
        await sleep(0.1);
        dialogIsOpen = false;
    }
</script>

<Dialog.Root bind:open={dialogIsOpen} onOpenChange={() => {
    hasSetContents = false;
    if (!dialogIsOpen) {
        editorQuillRef = null;
    }
}}>
    <section id="notesEnvelope">
        <ContextMenu.Root>
            <ContextMenu.Trigger>
                {#snippet child({ props })}
                    <h2 {...props}>NOTES:</h2>
                {/snippet}
            </ContextMenu.Trigger>
            {#if hasEditPermission}
                <ContextMenu.Portal to="#page" class="myContextMenu">
                    <ContextMenu.Content>
                        <ContextMenu.Item>
                            <Dialog.Trigger>
                                Edit Notes
                            </Dialog.Trigger>
                        </ContextMenu.Item>
                    </ContextMenu.Content>
                </ContextMenu.Portal>
            {/if}
        </ContextMenu.Root>
        {#if dbNotes.ops}
            <section id="notesDisplay">
                <QuillEditor
                    editor={$page.data.character.notes}
                    readOnly
                    toolbarOptions={null}
                    index="charNotesDisplay"
                    bindToQuill={bindToDisplayQuill}
                />
            </section>
        {/if}
    </section>
    <NormalDialog title="Edit Notes">
        <NormalForm method="post" action="?/saveNotes" fct={() => handleSubmit(loading, cleanupSubmit)}>
            <input type="hidden" name="character_id" id="character_id" value={$page.data.character.id} />
            <input type="hidden" name="notes" id="notes" value={dbFriendly} />
            <QuillEditor bind:editor={editedNotes} bindToQuill={bindToEditorQuill} index="charNotesEdit" />
            <footer>
                <Button type="submit" disabled={loading}>Save</Button>
            </footer>
        </NormalForm>
    </NormalDialog>
</Dialog.Root>

<style>
    section#notesEnvelope {
        position: relative;
        width: 100%;
        min-height: 0.4rem;

        h2 {
            cursor: pointer;
            position: absolute;
            top: -4.0rem;
            left: 2.4rem;
            font-size: 2.0rem;
        }
        & section#notesDisplay {
            margin: 1.6rem 2.4rem 0.6rem;
        }
    }
</style>
