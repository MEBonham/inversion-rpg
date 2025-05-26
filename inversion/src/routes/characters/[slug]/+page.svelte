<script>
    import { goto } from "$app/navigation";
    import NormalPage from "$lib/components/NormalPage.svelte";
	import { Dialog } from "bits-ui";
	import { calcSkillPoints, calcMaxSkillPoints } from "$lib/characterCalc";
	import RumorsBox from "./RumorsBox.svelte";
	import BufferDot from "$lib/components/BufferDot.svelte";
    import NormalDialog from "$lib/components/NormalDialog.svelte";
	import PencilEditIcon from "$lib/components/icons/PencilEditIcon.svelte";
	import EditCharBackgrounds from "./EditCharBackgrounds.svelte";
    import EditCharAncestries from "./EditCharAncestries.svelte";
    import EditCharLanguages from "./EditCharLanguages.svelte";

    let { data } = $props();
    let profile = $derived(data.profile);
    let cur = $derived(data.character);
    let skillPointsSpent = $derived(calcSkillPoints(cur));
    let skillPointsMax = $derived(calcMaxSkillPoints(cur));
    let backstories = $derived(data.backstories);
    let backgroundsMapped = $derived(cur.character_backgrounds.map((obj) => obj.backgrounds));
    let ancestriesMapped = $derived(cur.character_ancestries.map((obj) => obj.ancestries));
    let languagesMapped = $derived(cur.character_languages.map((obj) => obj.languages));

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

    let backgroundsDialogOpen = $state(false);
    const closeBackgroundsDialog = () => backgroundsDialogOpen = false;
    let ancestriesDialogOpen = $state(false);
    const closeAncestriesDialog = () => ancestriesDialogOpen = false;
    let languagesDialogOpen = $state(false);
    const closeLanguagesDialog = () => languagesDialogOpen = false;

    let loading = $state(false);
</script>

<NormalPage title={initialLoad ? "Loading ..." : cur.character_name}>
    {#if !initialLoad}
        <header id="sheetHeader">
            <aside>
                <span>{cur.character_level}</span>
            </aside>
            <div>
                <h2>
                    {#if hasEditPermission}
                        <Dialog.Root bind:open={backgroundsDialogOpen}>
                            <Dialog.Trigger>
                                {#snippet child({ props })}
                                    <button class="h2lineup" {...props}>
                                        <PencilEditIcon size="2.0rem" />
                                    </button>
                                {/snippet}
                            </Dialog.Trigger>
                            <NormalDialog title="Edit Backgrounds">
                                <EditCharBackgrounds action="?/saveBackgrounds" closeDialog={() => backgroundsDialogOpen = false} />
                            </NormalDialog>
                        </Dialog.Root>
                        <BufferDot />
                    {/if}
                    <span>BACKGROUND{backgroundsMapped.length > 1 ? "S" : ""}:</span>
                    {#each backgroundsMapped as background, index}
                        {#if index !== 0}
                            <span>, </span>
                        {/if}
                        <span>{background.background_name}</span>
                    {/each}
                </h2>
                <h2>
                    {#if hasEditPermission}
                        <Dialog.Root bind:open={ancestriesDialogOpen}>
                            <Dialog.Trigger>
                                {#snippet child({ props })}
                                    <button class="h2lineup" {...props}>
                                        <PencilEditIcon size="2.0rem" />
                                    </button>
                                {/snippet}
                            </Dialog.Trigger>
                            <NormalDialog title="Edit Ancestries">
                                <EditCharAncestries action="?/saveAncestries" closeDialog={() => ancestriesDialogOpen = false} />
                            </NormalDialog>
                        </Dialog.Root>
                        <BufferDot />
                    {/if}
                    <span>{ancestriesMapped.length > 1 ? "ANCESTRIES" : "ANCESTRY"}:</span>
                    {#each ancestriesMapped as ancestry, index}
                        {#if index !== 0}
                            <span>, </span>
                        {/if}
                        <span>{ancestry.ancestry_name}</span>
                    {/each}
                </h2>
            </div>
            <RumorsBox {hasEditPermission} curId={cur.id} {backstories} />
            <footer>
                <h2>
                    {#if hasEditPermission}
                        <Dialog.Root bind:open={languagesDialogOpen}>
                            <Dialog.Trigger>
                                {#snippet child({ props })}
                                    <button class="h2lineup" {...props}>
                                        <PencilEditIcon size="2.0rem" />
                                    </button>
                                {/snippet}
                            </Dialog.Trigger>
                            <NormalDialog title="Edit Languages">
                                <EditCharLanguages action="?/saveLanguages" closeDialog={() => languagesDialogOpen = false} />
                            </NormalDialog>
                        </Dialog.Root>
                        <BufferDot />
                    {/if}
                    <span>LANGUAGE{languagesMapped.length > 1 ? "S" : ""}:</span>
                    {#each languagesMapped.sort((a, b) => a.language_name.localeCompare(b.language_name)) as language, index}
                        {#if index !== 0}
                            <span>, </span>
                        {/if}
                        <span>{language.language_name}</span>
                    {/each}
                </h2>
                <div>
                    <h2>
                        SKILL POINTS:
                        <span class="sp">{skillPointsSpent}</span>
                        /
                        <span class="sp">{skillPointsMax}</span>
                    </h2>
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

    button.h2lineup {
        position: relative;
        top: 0.4rem;
        height: 2.0rem;
    }
    span.sp {
        margin: 0 1.0rem;
    }
</style>
