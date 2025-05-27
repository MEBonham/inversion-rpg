<script>
    import { page } from "$app/stores";
    import { Checkbox, DropdownMenu, Label, Toggle } from "bits-ui";
    import { handleSubmit, sleep } from "$lib/utils.js";
    import NormalForm from "$lib/components/NormalForm.svelte";
    import Button from "$lib/components/Button.svelte";
    import CheckboxTrueIcon from "$lib/components/icons/CheckboxTrueIcon.svelte";
    import CheckboxFalseIcon from "$lib/components/icons/CheckboxFalseIcon.svelte";

    let { editingId=0, addableCampaigns, action, closeDialog } = $props();

    let selectedCampaign = $state((addableCampaigns || [])[0]);
    let dropdownCampaignSelectOpen = $state(false);
    const handleDropdownCampaignSelect = (campaign) => {
        selectedCampaign = campaign;
        dropdownCampaignSelectOpen = false;
    }

    let secretToggle = $state(true);
    let inheritorOfBestWishes = $state(false);

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
    <input type="hidden" name="inheritorOfBestWishes" id="inheritorOfBestWishes" bind:value={inheritorOfBestWishes} />
    <div>
        <div class="checkboxRow">
            <Checkbox.Root id="isInheritorOfBestWishes" bind:checked={inheritorOfBestWishes}>
                {#snippet children({ checked })}
                    {#if checked}
                        <CheckboxTrueIcon size="2.0rem" />
                    {:else}
                        <CheckboxFalseIcon size="2.0rem" />
                    {/if}                
                {/snippet}
            </Checkbox.Root>
            <Label.Root for="isInheritorOfBestWishes">Inheritor of "Goodbye and Best Wishes"?</Label.Root>
        </div>
        <p><em>A character with this option checked will have +10 Skill Points,<br />but cannot ever have Rank 4 or higher in any skill the predecessor<br />had at Rank 3 or higher.</em></p>
    </div>
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
