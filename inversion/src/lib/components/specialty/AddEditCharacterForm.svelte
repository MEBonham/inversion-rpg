<script>
    import { page } from "$app/stores";
    import { DropdownMenu, Toggle } from "bits-ui";
    import { handleSubmit, sleep } from "$lib/utils.js";
    import NormalForm from "$lib/components/NormalForm.svelte";
    import Button from "$lib/components/Button.svelte";

    let { editingId=0, addableCampaigns, action, closeDialog } = $props();

    let selectedCampaign = $state((addableCampaigns || [])[0]);
    let dropdownCampaignSelectOpen = $state(false);
    const handleDropdownCampaignSelect = (campaign) => {
        selectedCampaign = campaign;
        dropdownCampaignSelectOpen = false;
    }

    let secretToggle = $state(true);

    let loading = $state(false);
    const cleanupSubmit = async () => {
        await sleep(0.1);
        closeDialog();
    }
</script>

<NormalForm method="post" {action} fct={() => handleSubmit(loading, cleanupSubmit)}>
    <input type="hidden" name="editingId" id="editingId" value={editingId} />
    <label for="campaign">
        <span>Campaign:</span>
        <input type="hidden" name="campaignId" id="campaignId" bind:value={selectedCampaign.id} />
        <DropdownMenu.Root bind:open={dropdownCampaignSelectOpen}>
            <DropdownMenu.Trigger>
                {#snippet child({ props })}
                    <Button {...props}>
                        {selectedCampaign.campaign_title}
                    </Button>
                {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {#each addableCampaigns as campaign}
                    <DropdownMenu.Item>
                        {#snippet child({ props })}
                            <div {...props} onclick={() => handleDropdownCampaignSelect(campaign)}>
                                {campaign.campaign_title}
                            </div>
                        {/snippet}
                    </DropdownMenu.Item>
                {/each}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </label>
    <label for="character_name">
        <span>Character Name:</span>
        <input type="text" name="character_name" id="character_name" required />
    </label>
    <label for="slug">
        <span>Unique URL-Safe Name:</span>
        <input type="text" name="slug" id="slug" required />
    </label>
    <section>
        <input type="hidden" name="secret" id="secret" bind:value={secretToggle} />
        <Toggle.Root bind:pressed={secretToggle}>
            {#snippet child({ props })}
                <Button {...props} id="secretToggle">
                    <span>{secretToggle ? "Secret" : "Not Secret"}</span>
                </Button>
            {/snippet}
        </Toggle.Root>
    </section>
    <label for="level">
        <span>Level:</span>
        <input type="number" name="level" id="level" required />
    </label>
    {#if ["newCharacter", "editCharacter"].includes($page.form?.src) }
        <p class={$page.form.isError ? "warning" : ""}>
            {$page.form.message || "ERROR: Something went wrong."}
        </p>
    {/if}
    <footer>
        <Button type="submit" disabled={loading}>
            {loading ? "Loading ..." : "Save"}
        </Button>
    </footer>
</NormalForm>

<style>
    :global(button#secretToggle) {
        min-width: 12rem;
        display: flex;
        justify-content: center;
    }
</style>
