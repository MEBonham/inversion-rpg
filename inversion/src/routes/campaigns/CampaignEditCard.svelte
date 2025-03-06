<script>
    import { page } from "$app/stores";
	import { invalidate } from "$app/navigation"
    ;
    import { Collapsible, ContextMenu, Dialog } from "bits-ui";
    
    import { handleSubmit, sleep } from "$lib/utils.js";
    import QuillEditor from "$lib/components/QuillEditor.svelte";
    import PencilEditIcon from "$lib/components/icons/PencilEditIcon.svelte";
    import TriangleOpenerIcon from "$lib/components/icons/TriangleOpenerIcon.svelte";
	import NormalDialog from "$lib/components/NormalDialog.svelte";
	import NormalForm from "$lib/components/NormalForm.svelte";
    import Button from "$lib/components/Button.svelte";

    let { campaign, index } = $props();

    let initialTitle = $state();
    let initialViewPasscode = $state();
    let initialParticipatePasscode = $state();
    let editorContent = $state();
    let dbFriendly = $derived(JSON.stringify(editorContent || { ops: []}));
    $effect(() => {
        initialTitle = campaign.campaign_title;
        initialViewPasscode = campaign.view_passcode;
        initialParticipatePasscode = campaign.participate_passcode;
        editorContent = campaign.description;
    });

    let quillRef = $state();
    const bindToQuill = (quillInstance) => {
        quillRef = quillInstance;
    }

    let descriptionOpen = $state(false);
    let dialogOpen = $state(false);

    let loading = $state(false);
    const localHandleSubmit = () => {
        loading = true;
        return async ({ update }) => {
            await update();
            await sleep(0.1);
            loading = false;
            invalidate("/campaigns");
            quillRef.setContents(campaign.description);
            dialogOpen = false;
        };
    }
    const remoteDeleteFormSubmit = () => {
        const form = document.querySelector("#dialogDeleteUtility form");
        form.requestSubmit();
    };
</script>

<article>
    <Collapsible.Root bind:open={descriptionOpen}>
        <h3>
            <Collapsible.Trigger>
                {#snippet child({ props })}
                    <span {...props} class={descriptionOpen ? "open" : ""}>
                        <TriangleOpenerIcon />
                        {campaign.campaign_title}
                    </span>
                {/snippet}
            </Collapsible.Trigger>
            <Dialog.Root bind:open={dialogOpen} >
                <Dialog.Trigger>
                    {#snippet child({ props })}
                        <button {...props}>
                            <PencilEditIcon size="2.0rem" />
                        </button>
                    {/snippet}
                </Dialog.Trigger>
                <NormalDialog title="Edit Campaign">
                    <header id="dialogDeleteUtility">
                        <form method="post" action="?/deleteCampaign" fct={() => handleSubmit(loading)}>
                            <input type="hidden" name="campaign_id" id="campaign_id" value={campaign.id} />
                        </form>
                        <ContextMenu.Root>
                            <ContextMenu.Trigger>
                                {#snippet child({ props })}
                                    <Button {...props}>
                                        Right-click to delete campaign
                                    </Button>
                                {/snippet}
                            </ContextMenu.Trigger>
                            <ContextMenu.Portal to="#dialogDeleteUtility">
                                <ContextMenu.Content>
                                    <ContextMenu.Item>
                                        <Button onclick={() => remoteDeleteFormSubmit()}>Delete</Button>
                                    </ContextMenu.Item>
                                </ContextMenu.Content>
                            </ContextMenu.Portal>
                        </ContextMenu.Root>
                    </header>
                    <NormalForm method="post" action="?/editCampaign" fct={localHandleSubmit}>
                        <input type="hidden" name="campaign_id" id="campaign_id" value={campaign.id} />
                        <label for="campaign_title">
                            <span>Campaign Title:</span>
                            <input type="text" name="campaign_title" id="campaign_title" bind:value={initialTitle} required />
                        </label>
                        <label for="view_passcode">
                            <span>Passcode to View:</span>
                            <input type="text" name="view_passcode" id="view_passcode" bind:value={initialViewPasscode} required />
                        </label>
                        <label for="participate_passcode">
                            <span>Passcode to Participate:</span>
                            <input type="text" name="participate_passcode" id="participate_passcode" bind:value={initialParticipatePasscode} required />
                        </label>
                        <label for="description">
                            <span>Description:</span>
                            <input type="hidden" name="description" id="description" value={dbFriendly} />
                        </label>
                        <QuillEditor bind:editor={editorContent} index={-1} editingPrevious={true} />
                        <footer>
                            <Button onclick={() => dialogOpen = false}>Cancel</Button>
                            <Button type="submit" disabled={loading}>Save</Button>
                        </footer>
                    </NormalForm>
                </NormalDialog>
            </Dialog.Root>
        </h3>
        <Collapsible.Content>
            <QuillEditor
                bind:editor={editorContent}
                readOnly
                toolbarOptions={null}
                {index}
                {bindToQuill}
            />
        </Collapsible.Content>
    </Collapsible.Root>
</article>

<style>
    h3 {
        display: flex;
        align-items: center;
        gap: 0.8rem;

        & button {
            position: relative;
            top: -0.3rem;
            width: 2.0rem;
            height: 2.0rem;
        }

        & span {
            cursor: pointer;
        
            :global(svg) {
                position: relative;
                top: -0.3rem;
                transition: transform 0.2s linear;
                margin-right: 0.4rem;
            }
        }
        & span.open :global(svg) {
            transform: rotate(90deg);
        }
    }

    header {
        margin: 1.6rem 1.2rem 0.8rem;
        display: flex;
        justify-content: space-between;

        & :global(button) {
            background-color: var(--warningColor);
            color: var(--parchment);

            &:hover {
                background-color: var(--warningHover);
            }
        }
    }
</style>
