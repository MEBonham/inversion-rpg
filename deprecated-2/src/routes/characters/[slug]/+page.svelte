<script>
    import { goto } from "$app/navigation";
    import NormalPage from "$lib/components/NormalPage.svelte";

    let { data } = $props();
    let cur = $derived(data.character);
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
    let initialLoad = $state(true);
    let hasViewPermission = $state(false);
    let hasEditPermission = $state(false);
    $effect(() => {
        console.log(cur.secret, passcodes, data.originCampaign.view_passcode);
        if (cur.owner === profile?.id) {
            hasViewPermission = true;
            hasEditPermission = true;
        } else if (data.originCampaign.creator === profile?.id) {
            hasViewPermission = true;
            hasEditPermission = true;
        } else if (!cur.secret && passcodes.includes(data.originCampaign.view_passcode)) {
            hasViewPermission = true;
        } else if (!cur.secret && passcodes.includes(data.originCampaign.participate_passcode)) {
            hasViewPermission = true;
        }
        if (!hasViewPermission) {
            if (!profile) {
                goto("/login");
            } else {
                goto("/characters");
            }
        }
        initialLoad = false;
    });
</script>

<NormalPage title={initialLoad ? "Loading ..." : cur.character_name}>
    {#if !initialLoad}
        <p>Placeholder</p>
    {/if}
</NormalPage>
