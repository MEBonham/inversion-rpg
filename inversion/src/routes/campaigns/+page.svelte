<script>
    import { page } from "$app/stores";
    import { handleSubmit } from "$lib/utils.js";
    import Button from "$lib/components/Button.svelte";
    import QuillEditor from "$lib/components/QuillEditor.svelte";
	import NormalForm from "$lib/components/NormalForm.svelte";
    import NormalPage from "$lib/components/NormalPage.svelte";
    import PasscodesSection from "./PasscodesSection.svelte";

    let { data } = $props();
    let session = $derived(data.session);
    let profile = $derived(data.profile);

    let myCampaigns = $derived(data.allCampaigns.filter(campaign => campaign.creator === profile?.id));

    let description = $state();
    let dbFriendly = $derived(JSON.stringify(description));

    let loading = $state(false);
</script>

<NormalPage title="Campaign Management">
    <PasscodesSection {profile} />
    {#if session}
        <section>
            <h2>My Campaigns</h2>
            {#each myCampaigns as campaign}
                <article>
                    <h3>{campaign.campaign_title}</h3>
                </article>
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
        </section>
    {/if}
</NormalPage>
