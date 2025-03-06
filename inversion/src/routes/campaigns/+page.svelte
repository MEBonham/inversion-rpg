<script>
    import { page } from "$app/stores";
    import { handleSubmit } from "$lib/utils.js";
    import Button from "$lib/components/Button.svelte";
    import QuillEditor from "$lib/components/QuillEditor.svelte";
	import NormalForm from "$lib/components/NormalForm.svelte";
    import NormalPage from "$lib/components/NormalPage.svelte";
    import PasscodesSection from "./PasscodesSection.svelte";
	import SnorerIcon from "$lib/components/icons/SnorerIcon.svelte";
	import RevealIcon from "$lib/components/icons/RevealIcon.svelte";
	import CampaignEditCard from "./CampaignEditCard.svelte";

    let { data } = $props();
    let session = $derived(data.session);
    let profile = $derived(data.profile);

    let myCampaigns = $derived(data.allCampaigns.filter(campaign => campaign.creator === profile?.id));

    let passcodes = $derived.by(() => {
        if (profile) {
            return profile.passcodes;
        }
        if (typeof document !== "undefined") {
            return JSON.parse(window.localStorage.getItem("inversion-guest-passcodes") || "[]");
        }
        return [];
    });
    let campaignsDisplayed = data.allCampaigns.filter((campaign) => {
        if (campaign.creator === profile?.id) return true;
        if (passcodes.includes(campaign.view_passcode)) return true;
        if (passcodes.includes(campaign.participate_passcode)) return true;
        return false;
    });

    let description = $state();
    let dbFriendly = $derived(JSON.stringify(description));

    let loading = $state(false);
</script>

<NormalPage title="Campaign Management">
    <PasscodesSection {profile} />
    {#if session}
        <section>
            <h2>My Campaigns</h2>
            {#each myCampaigns as campaign, index}
                <CampaignEditCard {campaign} {index} />
            {/each}
        </section>
        <section>
            <h2>New Campaign</h2>
            <NormalForm method="post" action="?/newCampaign" fct={() => handleSubmit(loading)}>
                <label for="campaign_title">
                    <span>Campaign Title:</span>
                    <input type="text" name="campaign_title" id="campaign_title" required />
                </label>
                <label for="view_passcode">
                    <span>Passcode to View:</span>
                    <input type="text" name="view_passcode" id="view_passcode" required />
                </label>
                <label for="participate_passcode">
                    <span>Passcode to Participate:</span>
                    <input type="text" name="participate_passcode" id="participate_passcode" required />
                </label>
                <label for="description">
                    <span>Description:</span>
                    <input type="hidden" name="description" id="description" value={dbFriendly} />
                </label>
                <QuillEditor bind:editor={description} />
                {#if $page.form?.src === "newCampaign"}
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
        </section>
        <section>
            <h2>Hide/Show Campaigns</h2>
            {#each campaignsDisplayed as campaign}
                <article>
                    <h3>
                        <span class={profile?.suppressed_campaigns?.includes(campaign.id) ? "strikethrough" : ""}>{campaign.campaign_title}</span>
                        {#if !profile?.suppressed_campaigns?.includes(campaign.id)}
                            <form method="post" action="?/suppressCampaign" fct={() => handleSubmit(loading)} class="inH3">
                                <input type="hidden" name="campaignId" value={campaign.id} />
                                <Button type="submit" disabled={loading}>
                                    <SnorerIcon size="2.0rem" />
                                </Button>
                            </form>
                        {:else}
                            <form method="post" action="?/unsuppressCampaign" fct={() => handleSubmit(loading)} class="inH3">
                                <input type="hidden" name="campaignId" value={campaign.id} />
                                <Button type="submit" disabled={loading}>
                                    <RevealIcon size="2.0rem" />
                                </Button>
                            </form>
                        {/if}
                    </h3>
                </article>
            {/each}
        </section>
    {/if}
</NormalPage>

<style>
    h3 {
        display: flex;
        align-items: center;

        & span.strikethrough {
            text-decoration: line-through;
        }
    }

    form.inH3 {
        height: 2.0rem;
        display: inline-block;
        margin-left: 1.6rem;

        & :global(button) {
            width: 2.0rem;
            height: 2.0rem;
            padding: 0;

            & :global(svg) {
                position: relative;
                top: -0.3rem;
            }
        }
    }
</style>
