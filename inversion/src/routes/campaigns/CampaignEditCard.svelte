<script>
    import { page } from "$app/stores";
    import { Collapsible, Dialog } from "bits-ui";
    import { sleep } from "$lib/utils.js";
    import QuillEditor from "$lib/components/QuillEditor.svelte";
    import PencilEditIcon from "$lib/components/icons/PencilEditIcon.svelte";
    import TriangleOpenerIcon from "$lib/components/icons/TriangleOpenerIcon.svelte";
	import NormalDialog from "$lib/components/NormalDialog.svelte";
	import NormalForm from "$lib/components/NormalForm.svelte";
    import Button from "$lib/components/Button.svelte";

    let { campaign, index } = $props();
    let initialTitle = $state(campaign.campaign_title);
    let initialViewPasscode = $state(campaign.view_passcode);
    let initialParticipatePasscode = $state(campaign.participate_passcode);
    let editorContent = $state(campaign.description);
    let dbFriendly = $derived(JSON.stringify(editorContent));

    let dialogOpen = $state(false);

    let loading = $state(false);
    const handleSubmit = () => {
        loading = true;
        return async ({ update }) => {
            await update();
            await sleep(0.1);
            loading = false;
            dialogOpen = false;
        };
    }
</script>

<article>
    <Collapsible.Root>
        <h3>
            <Collapsible.Trigger>
                {#snippet child({ props })}
                    <span {...props}>
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
                    <NormalForm method="post" action="?/editCampaign" fct={handleSubmit}>
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
            <QuillEditor editor={editorContent} readOnly toolbarOptions={null} {index} />
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
    }
</style>
