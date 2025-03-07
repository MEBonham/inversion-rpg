<script>
    import { Dialog } from "bits-ui";
    import Button from "$lib/components/Button.svelte";
    import NormalDialog from "$lib/components/NormalDialog.svelte";
    import NormalPage from "$lib/components/NormalPage.svelte";
	import AddEditCharacterForm from "$lib/components/specialty/AddEditCharacterForm.svelte";
	import BufferDot from "$lib/components/BufferDot.svelte";

    let { data } = $props();
    let profile = $derived(data.profile);
    let passcodes = $derived.by(() => {
        if (profile) {
            return profile.passcodes;
        }
        if (typeof document !== "undefined") {
            return JSON.parse(window.localStorage.getItem("inversion-guest-passcodes") || "[]");
        }
        return [];
    });

    let viewableCampaigns = $derived(
        data.allCampaigns.filter((campaign) => {
            if (campaign.creator === profile?.id) return true;
            if (passcodes.includes(campaign.view_passcode)) return true;
            return (passcodes.includes(campaign.participate_passcode));
        })
    );
    let displayedCampaigns = $derived(
        viewableCampaigns.filter((campaign) => {
            if (profile.suppressed_campaigns.includes(campaign.id)) return false;
            return true;
        })
    );
    let addableCampaigns = $derived(
        data.allCampaigns.filter((campaign) => {
            if (campaign.creator === profile?.id) return true;
            return (passcodes.includes(campaign.participate_passcode));
        })
    );

    let revealedCharacters = $derived(
        data.allCharacters.filter((character) => {
            if (!character.secret) return true;
            if (data.allCampaigns.find((campaign) => campaign.id === character.campaign)?.creator === profile?.id) return true;
            return (character.owner === profile?.id);
        })
    );

    let dialogIsOpen = $state(false);
    const closeDialog = () => dialogIsOpen = false;
</script>

<NormalPage title="Characters">
    <section>
        <article>
            <Dialog.Root bind:open={dialogIsOpen}>
                <Dialog.Trigger>
                    {#snippet child({ props })}
                        <Button {...props} disabled={addableCampaigns.length === 0}>
                            New Character
                        </Button>
                    {/snippet}
                </Dialog.Trigger>
                <NormalDialog title="New Character">
                    <AddEditCharacterForm {addableCampaigns} action="?/newCharacter" {closeDialog} />
                </NormalDialog>
            </Dialog.Root>
        </article>
    </section>
    <section>
        <h2>Characters</h2>
        {#each displayedCampaigns as campaign}
            <article>
                <h3>{campaign.campaign_title}</h3>
                <p>
                    {#each revealedCharacters.filter((character) => character.campaign === campaign.id) as character, index}
                        <a href={`/characters/${character.slug}`}>{character.character_name}</a>
                        {#if index < revealedCharacters.filter((character) => character.campaign === campaign.id).length - 1}
                            <BufferDot />
                        {/if}
                    {/each}
                </p>
            </article>
        {/each}
    </section>
</NormalPage>

<style>
    section {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }
</style>
