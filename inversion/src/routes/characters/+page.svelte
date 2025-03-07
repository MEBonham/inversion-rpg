<script>
    import { Dialog } from "bits-ui";
    import Button from "$lib/components/Button.svelte";
    import NormalDialog from "$lib/components/NormalDialog.svelte";
    import NormalPage from "$lib/components/NormalPage.svelte";

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
</script>

<NormalPage title="Characters">
    <section>
        <Dialog.Root>
            <Dialog.Trigger>
                {#snippet child({ props })}
                    <Button {...props}>New Character</Button>
                {/snippet}
            </Dialog.Trigger>
            
        </Dialog.Root>
    </section>
    <section>
        <h2>Characters</h2>
        {#each displayedCampaigns as campaign}
            <article>
                <h3>{campaign.campaign_title}</h3>
            </article>
        {/each}
    </section>
</NormalPage>
