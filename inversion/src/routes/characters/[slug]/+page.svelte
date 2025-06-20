<script>
    import { goto } from "$app/navigation";
    import NormalPage from "$lib/components/NormalPage.svelte";
	import { Dialog } from "bits-ui";
	import { BASE_SKILLS } from "$lib/constants";
    import { sleep } from "$lib/utils";
	import { calcSkillPoints, calcMaxSkillPoints } from "$lib/characterCalc";
    import H2withContextEditMenu from "./H2withContextEditMenu.svelte";
	import RumorsBox from "./RumorsBox.svelte";
	import BufferDot from "$lib/components/BufferDot.svelte";
    import NormalDialog from "$lib/components/NormalDialog.svelte";
	import PencilEditIcon from "$lib/components/icons/PencilEditIcon.svelte";
	import EditCharBackgrounds from "./EditCharBackgrounds.svelte";
    import EditCharAncestries from "./EditCharAncestries.svelte";
    import EditCharLanguages from "./EditCharLanguages.svelte";
    import NormalSkillsHeader from "./NormalSkillsHeader.svelte";
    import NormalSkillWidget from "./NormalSkillWidget.svelte";
	import GunsSkillWidget from "./GunsSkillWidget.svelte";
	import CurrentStatsTracker from "./CurrentStatsTracker.svelte";
	import NotesWidget from "./NotesWidget.svelte";

    let { data } = $props();
    let profile = $derived(data.profile);
    let cur = $derived(data.character);
    let skillPointsSpent = $derived(calcSkillPoints(cur));
    let skillPointsMax = $derived(calcMaxSkillPoints(cur));
    let backstories = $derived(data.backstories);
    let backgroundsMapped = $derived(cur.character_backgrounds.map((obj) => obj.backgrounds.background_name));
    let ancestriesMapped = $derived(cur.character_ancestries.map((obj) => obj.ancestries.ancestry_name));
    let languagesMapped = $derived(cur.character_languages.map((obj) => obj.languages.language_name));
    let skillsMapped = $derived(cur.character_skills ?? BASE_SKILLS);

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
    
    let dialogIsOpen = $state(false);
    const closeDialog = () => dialogIsOpen = false;
    let whichDialog = $state(null);
    let dialogTitles = {
        backgrounds: "Edit Backgrounds",
        ancestries: "Edit Ancestries",
        languages: "Edit Languages",
    };

    let loading = $state(false);
    const cleanupSubmit = async () => {
        await sleep(0.1);
        closeDialog();
    }
</script>

<NormalPage title={initialLoad ? "Loading ..." : cur.character_name}>
    {#if !initialLoad}
        <Dialog.Root bind:open={dialogIsOpen}>
            <header id="sheetHeader">
                <aside>
                    <span>{cur.character_level}</span>
                </aside>
                <main>
                    <div class="colOf2 col1">
                        <div></div>
                        <H2withContextEditMenu
                            mappedSelections={backgroundsMapped}
                            {hasEditPermission}
                            singularTitle="Background"
                            pluralTitle="Backgrounds"
                            focusFct={() => whichDialog = "backgrounds"}
                        />
                        <H2withContextEditMenu
                            mappedSelections={ancestriesMapped}
                            {hasEditPermission}
                            singularTitle="Ancestry"
                            pluralTitle="Ancestries"
                            focusFct={() => whichDialog = "ancestries"}
                        />
                        <H2withContextEditMenu
                            mappedSelections={languagesMapped}
                            {hasEditPermission}
                            singularTitle="Language"
                            pluralTitle="Languages"
                            focusFct={() => whichDialog = "languages"}
                        />
                    </div>
                    <div class="colOf2">
                        <RumorsBox {hasEditPermission} curId={cur.id} {backstories} />
                        <footer>
                            <h2>
                                SKILL POINTS:
                                <span class="sp">{skillPointsSpent}</span>
                                /
                                <span class="sp">{skillPointsMax}</span>
                            </h2>
                        </footer>
                    </div>
                </main>
            </header>
            <NormalDialog title={dialogTitles[whichDialog]}>
                {#if whichDialog === "backgrounds"}
                    <EditCharBackgrounds action="?/saveBackgrounds" closeDialog={() => closeDialog()} />
                {:else if whichDialog === "ancestries"}
                    <EditCharAncestries action="?/saveAncestries" closeDialog={() => closeDialog()} />
                {:else if whichDialog === "languages"}
                    <EditCharLanguages action="?/saveLanguages" closeDialog={() => closeDialog()} />
                {/if}
            </NormalDialog>
        </Dialog.Root>
        <main id="pg1main">
            <div id="pg1mainMisc">
                <header>
                    <CurrentStatsTracker />
                    <section id="combatSkills">
                        <NormalSkillsHeader />
                        {#each skillsMapped.filter((skill) => skill.category === "Combat" && skill.regular) as skill}
                            <NormalSkillWidget {skill} {hasEditPermission} />
                        {/each}
                        <GunsSkillWidget {hasEditPermission} skill={skillsMapped.find((skill) => skill.skillName === "GUNS")} />
                    </section>
                </header>
                <NotesWidget {hasEditPermission} />
            </div>
            <aside id="skillsCol">
                <section id="socialSkills">
                    <NormalSkillsHeader />
                    {#each skillsMapped.filter((skill) => skill.category === "Social") as skill}
                        <NormalSkillWidget {skill} {hasEditPermission} />
                    {/each}
                </section>
                <section id="knowledgeSkills">
                    <NormalSkillsHeader />
                    {#each skillsMapped.filter((skill) => skill.category === "Knowledge") as skill}
                        <NormalSkillWidget {skill} {hasEditPermission} />
                    {/each}
                </section>
                <section id="actionSkills">
                    <NormalSkillsHeader />
                    {#each skillsMapped.filter((skill) => skill.category === "Action") as skill}
                        <NormalSkillWidget {skill} {hasEditPermission} />
                    {/each}
                </section>
            </aside>
        </main>
    {/if}
</NormalPage>

<style>
    #sheetHeader {
        position: relative;
        margin: 1.0rem 0;
        padding-left: 3.0rem;
        padding-right: 9.0rem;
        width: 100%;
        display: flex;
        flex-direction: column;

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
        & > main {
            width: 100%;
            display: flex;
            gap: 1.6rem;

            & > div.colOf2 {
                flex-grow: 1;
                min-width: 30rem;
                padding: 1.0rem 0;
                display: flex;
                flex-direction: column;
                gap: 1.2rem;

                &.col1 {
                    justify-content: space-between;
                }
                & footer {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }
            }
        } 

        & :global(h2) {
            margin: 0;
            font-size: 2.0rem;
        }
    }

    #pg1main {
        margin-top: 3.0rem;
        display: flex;
        gap: 1.0rem;

        & #pg1mainMisc {
            flex-grow: 3.5;

            & > header {
                display: flex;
                gap: 1.0rem;

                & #combatSkills {
                    min-width: 40.0rem;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 1.6rem;
                }
            }
        }
        & #skillsCol {
            min-width: 40.0rem;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 3.4rem;

            & section {
                display: flex;
                flex-direction: column;
                gap: 1.6rem;
            }
        }
    }
    
    span.sp {
        margin: 0 1.0rem;
    }
</style>
