<script>
    import { goto } from "$app/navigation";
    import NormalPage from "$lib/components/NormalPage.svelte";
	import RumorsBox from "./RumorsBox.svelte";

    let { data } = $props();
    let cur = $derived(data.character);
    let backstories = $derived(data.backstories);
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

    let loading = $state(false);
</script>

<NormalPage title={initialLoad ? "Loading ..." : cur.character_name}>
    {#if !initialLoad}
        <header id="sheetHeader">
            <aside>
                <span>{cur.character_level}</span>
            </aside>
            <div>
                <h2>BACKGROUND(S): _________________________</h2>
                <h2>ANCESTRY: ________________________________</h2>
            </div>
            <RumorsBox {hasEditPermission} curId={cur.id} {backstories} />
            <footer>
                <h2>LANGUAGES: ______________________________</h2>
                <div>
                    <h2>SKILL POINTS:</h2> 
                </div>
            </footer>
        </header>
    {/if}
</NormalPage>

<style>
    #sheetHeader {
        position: relative;
        margin: 1.0rem 0;
        padding-right: 9.0rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1.0rem;

        & > aside {
            position: absolute;
            top: 0;
            right: 0;
            min-width: 8.0rem;
            aspect-ratio: 1/1;
            padding: 0.6rem 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-image: url("/charSheet/Level Circle.png");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;

            & span {
                margin-top: 1.0rem;
                font-size: 3.8rem;
            }
        }
        & > div {
            flex-grow: 1;
            min-width: 30rem;
            height: 100%;
            padding: 1.0rem 3.0rem;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            gap: 0.6rem;
        }
        & > footer {
            width: 100%;
            padding: 1.0rem 3.0rem;
            display: flex;
            gap: 1.0rem;

            & h2 {
                flex-grow: 2.5;
            }
            & div {
                flex-grow: 1;
            }
        }

        & :global(h2) {
            margin: 0;
            font-size: 2.0rem;
        }
    }
</style>
