<script>
    import { goto } from "$app/navigation";
    import { Dialog } from "bits-ui";
    import NormalPage from "$lib/components/NormalPage.svelte";
    import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
	import BufferDot from "$lib/components/BufferDot.svelte";
	import NormalDialog from "$lib/components/NormalDialog.svelte";
    import AddRumorForm from "$lib/components/specialty/AddRumorForm.svelte";

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

    let rumorDialogOpen = $state(false);
    const closeRumorDialog = () => rumorDialogOpen = false;
</script>

<NormalPage title={initialLoad ? "Loading ..." : cur.character_name}>
    {#if !initialLoad}
        <header class="sheetHeader">
            <header>
                <img src="/charSheet/charSheetHeadLogo.png" alt="logo" />
                <div>
                    <main>
                        <p>Background: _________</p>
                        <p>Ancestry: ___________</p>
                    </main>
                    <aside>
                        <span>{cur.character_level}</span>
                    </aside>
                </div>
            </header>
            <footer>
                <header>
                    <h2>Rumors & Backstory</h2>
                    <BufferDot />
                    {#if hasEditPermission}
                        <Dialog.Root bind:open={rumorDialogOpen}>
                            <Dialog.Trigger>
                                {#snippet child({ props })}
                                    <button { ...props }>
                                        <PlusIcon size="2.0rem" />
                                    </button>
                                {/snippet}
                            </Dialog.Trigger>
                            <NormalDialog
                                title="New Rumor or Backstory"
                                description="Rumors are small stories and local gossip about your character. When your
                                name comes up in a tavern, these are what people bring up. Rumors connect you to the world.
                                They give you details you can build your character on top of."
                            >
                                <AddRumorForm editingId={cur.id} action="?/addRumor" closeDialog={closeRumorDialog} />
                            </NormalDialog>
                        </Dialog.Root>
                    {/if}
                </header>
                {#each backstories as backstory}
                    <article class="backstory">
                        {#if backstory.is_rumor}
                            <em>({backstory.is_true ? "True" : "False"} rumor)</em>
                            <BufferDot />
                        {/if}
                        <strong>{backstory.short_summary}{backstory.description ? ":" : ""}</strong>
                        <p>{backstory.description}</p>
                    </article>
                {/each}
            </footer>
        </header>
    {/if}
</NormalPage>

<style>
    .sheetHeader {
        width: 100%;

        & > header {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            & img {
                margin-right: 10%;
                flex-grow: 1;
                max-width: 20.0rem;
            }
            & > div {
                flex-grow: 2;
                display: flex;
                justify-content: space-between;

                & aside {
                    min-width: 5.0rem;
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
                    }
                }
            }
        }
        & > footer {
            margin-top: 0.8rem;
            width: 100%;
            border: 1px solid var(--invertParchment);
            border-radius: 0.4rem;
            padding: 0 1.0rem 0.6rem;

            & article.backstory {
                display: flex;
                gap: 0.6rem;
            }

            & header {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                & button {
                    width: 2.0rem;
                    height: 2.0rem;
                    margin-top: 0.6rem;
                    color: var(--boldTorquoise);
                }
            }
        }
    }
</style>
