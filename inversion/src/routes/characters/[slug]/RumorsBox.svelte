<script>
    import { ContextMenu, Dialog } from "bits-ui";

    import { handleSubmit } from "$lib/utils.js";
    import Button from "$lib/components/Button.svelte";
    import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
	import BufferDot from "$lib/components/BufferDot.svelte";
	import NormalDialog from "$lib/components/NormalDialog.svelte";
    import AddRumorForm from "$lib/components/specialty/AddRumorForm.svelte";

    let { hasEditPermission, curId, backstories } = $props();

    let rumorDialogOpen = $state(false);
    const closeRumorDialog = () => rumorDialogOpen = false;

    let backstoryIdToDelete = $state();
    const deleteBackstory = () => {
    // const deleteBackstory = (backstoryId) => {
        // backstoryIdToDelete = backstoryId;
        // console.log({ backstoryIdToDelete, inputVal: document.querySelector("#deleteBackstoryForm input").value });
        const form = document.getElementById("deleteBackstoryForm");
        form.requestSubmit();
    };
</script>

<article class="rumorsBox">
    <header>
        <h2>RUMORS & BACKSTORY</h2>
        {#if hasEditPermission}
            <BufferDot />
            <Dialog.Root bind:open={rumorDialogOpen}>
                <Dialog.Trigger>
                    {#snippet child({ props })}
                        <button { ...props }>
                            <PlusIcon size="2.0rem" />
                        </button>
                    {/snippet}
                </Dialog.Trigger>
                <NormalDialog
                    title="New Rumor or Backstory"
                    description="Rumors are small stories and local gossip about your character. When your
                    name comes up in a tavern, these are what people bring up. Rumors connect you to the world.
                    They give you details you can build your character on top of."
                >
                    <AddRumorForm editingId={curId} action="?/addRumor" closeDialog={closeRumorDialog} />
                </NormalDialog>
            </Dialog.Root>
        {/if}
    </header>
    <form id="deleteBackstoryForm" method="post" action="?/deleteBackstory" fct={() => handleSubmit(loading)}>
        <input type="hidden" name="backstoryIdToDelete" id="backstoryIdToDelete" bind:value={backstoryIdToDelete} />
    </form>
    {#each backstories as backstory}
        <ContextMenu.Root onOpenChange={() => backstoryIdToDelete = backstory.id}>
            <ContextMenu.Trigger>
                {#snippet child({ props })}
                    <article class="backstory clickable" {...props}>
                        {#if backstory.is_rumor}
                            <em>({backstory.is_true ? "True" : "False"} rumor)</em>
                            <BufferDot />
                        {/if}
                        <strong>{backstory.short_summary}{backstory.description ? ":" : ""}</strong>
                        <p>{backstory.description}</p>
                    </article>
                {/snippet}
            </ContextMenu.Trigger>
            <ContextMenu.Portal to="#page">
                <ContextMenu.Content>
                    <ContextMenu.Item>
                        <!-- <Button onclick={() => {
                            console.log(backstory.id);
                            deleteBackstory(backstory.id)
                        }}>Delete Rumor/Backstory</Button> -->
                        <Button onclick={() => deleteBackstory()}>Delete Rumor/Backstory</Button>
                    </ContextMenu.Item>
                </ContextMenu.Content>
            </ContextMenu.Portal>
        </ContextMenu.Root>
    {/each}
</article>

<style>
    article.rumorsBox {
        width: calc(50% - 5.0rem);
        min-width: 30rem;
        height: 100%;
        border: 1px solid var(--invertParchment);
        border-radius: 0.4rem;
        padding: 1.0rem 1.0rem 0.6rem;

        & article.backstory {
            display: flex;
            gap: 0.6rem;
        }

        & header {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            & h2 {
                position: relative;
                top: 0.4rem;
            }
            & button {
                position: relative;
                top: 0.2rem;
                width: 2.0rem;
                height: 2.0rem;
                color: var(--boldTorquoise);
            }
        }
    }
</style>
