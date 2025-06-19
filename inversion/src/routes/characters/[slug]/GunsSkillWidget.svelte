<script>
    import { page } from "$app/stores";
    import { Checkbox, ContextMenu, Dialog, Label } from "bits-ui";
    import { sleep, handleSubmit } from "$lib/utils";
    import NormalForm from "$lib/components/NormalForm.svelte";
	import NormalDialog from "$lib/components/NormalDialog.svelte";
    import Button from "$lib/components/Button.svelte";
    import CheckboxFalseIcon from "$lib/components/icons/CheckboxFalseIcon.svelte";
    import CheckboxTrueIcon from "$lib/components/icons/CheckboxTrueIcon.svelte";

    let { hasEditPermission, skill } = $props();
    $inspect(skill.rank);
    const range = ["P", "R", "S", "5"];
    const rangeMeanings = {
        P: "pistols",
        R: "rifles",
        S: "shotguns",
        5: "rank5",
    };
    let pistols = $state(skill.rank.pistols ?? false);
    let rifles = $state(skill.rank.rifles ?? false);
    let shotguns = $state(skill.rank.shotguns ?? false);
    let rank5 = $state(skill.rank.rank5 ?? false);
    let skillObj = $derived(JSON.stringify({
        pistols,
        rifles,
        shotguns,
        rank5: (pistols && rifles && shotguns && rank5),
    }));

    let skillDialogOpen = $state(false);
    const closeDialog = () => skillDialogOpen = false;

    let loading = $state(false);
    const cleanupSubmit = async () => {
        await sleep(0.1);
        closeDialog();
    }
</script>

<Dialog.Root bind:open={skillDialogOpen}>
    <ContextMenu.Root>
        <ContextMenu.Trigger>
            {#snippet child({ props })}
                <article class:clickable={hasEditPermission} {...props}>
                    <h2 class="label">
                        {skill.skillName}
                    </h2>
                    <div class="body">
                        {#each range as type}
                            <div>
                                <span class:rank5icon={type === "5"}>{type !== "5" ? type : ""}</span>
                                <div class="bubble" class:filled={skill.rank[rangeMeanings[type]]}></div>
                            </div>
                        {/each}
                    </div>
                </article>
            {/snippet}
        </ContextMenu.Trigger>
        {#if hasEditPermission}
            <ContextMenu.Portal to="#page">
                <ContextMenu.Content>
                    <ContextMenu.Item>
                        <Dialog.Trigger>
                            Edit Skill
                        </Dialog.Trigger>
                    </ContextMenu.Item>
                </ContextMenu.Content>
            </ContextMenu.Portal>
        {/if}
    </ContextMenu.Root>
    <NormalDialog title={`Edit ${skill.skillName}`}>
        <NormalForm method="post" action="?/saveSkill" fct={() => handleSubmit(loading, cleanupSubmit)}>
            <input type="hidden" name="character_id" id="character_id" value={$page.data.character.id} />
            <input type="hidden" name="skillName" id="skillName" value={skill.skillName} />
            <input type="hidden" name="newRank" id="newRank" value={skillObj} />
            <div class="checkboxRow">
                <Checkbox.Root id="pistols" bind:checked={pistols}>
                    {#snippet children({ checked })}
                        {#if checked}
                            <CheckboxTrueIcon size="2.0rem" />
                        {:else}
                            <CheckboxFalseIcon size="2.0rem" />
                        {/if}                
                    {/snippet}
                </Checkbox.Root>
                <Label.Root for="pistols">Pistols</Label.Root>
            </div>
            <div class="checkboxRow">
                <Checkbox.Root id="rifles" bind:checked={rifles}>
                    {#snippet children({ checked })}
                        {#if checked}
                            <CheckboxTrueIcon size="2.0rem" />
                        {:else}
                            <CheckboxFalseIcon size="2.0rem" />
                        {/if}                
                    {/snippet}
                </Checkbox.Root>
                <Label.Root for="rifles">Rifles</Label.Root>
            </div>
            <div class="checkboxRow">
                <Checkbox.Root id="shotguns" bind:checked={shotguns}>
                    {#snippet children({ checked })}
                        {#if checked}
                            <CheckboxTrueIcon size="2.0rem" />
                        {:else}
                            <CheckboxFalseIcon size="2.0rem" />
                        {/if}                
                    {/snippet}
                </Checkbox.Root>
                <Label.Root for="shotguns">Shotguns</Label.Root>
            </div>
            <div class="checkboxRow">
                <Checkbox.Root id="rank5" bind:checked={rank5} disabled={!pistols || !rifles || !shotguns}>
                    {#snippet children({ checked })}
                        {#if checked}
                            <CheckboxTrueIcon size="2.0rem" />
                        {:else}
                            <CheckboxFalseIcon size="2.0rem" />
                        {/if}                
                    {/snippet}
                </Checkbox.Root>
                <Label.Root for="rank5">
                    <div class="rank5icon"></div>
                </Label.Root>
            </div>
            <footer>
                <Button type="submit" disabled={loading}>
                    {loading ? "Loading ..." : "Save"}
                </Button>
            </footer>
        </NormalForm>
    </NormalDialog>
</Dialog.Root>

<style>
    article {
        width: 100%;
        padding-right: 8.0rem;
        display: flex;
        gap: 1.4rem;
        align-items: center;
        
        & .label {
            position: relative;
            top: -0.2rem;
            width: calc(30% - 0.3rem);
            height: 100%;
            font-size: 1.4rem;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
        }
        & .body {
            width: calc(70% - 0.3rem);
            display: flex;
            justify-content: space-between;

            & > div {
                display: flex;
                flex-direction: column;
                align-items: center;

                &:last-child {
                    justify-content: flex-end;

                    & span.rank5icon {
                        position: relative;
                        top: -0.4rem;
                    }
                }
            }

            & div.bubble {
                width: 1.4rem;
                height: 1.4rem;
                border-radius: 50%;
                border: 0.2rem solid var(--invertParchment);

                &.filled {
                    background-color: var(--boldTorquoise);
                }
            }
        }
    }

    div.rank5icon,
    span.rank5icon {
        width: 1.6rem;
        height: 1.6rem;
        background-size: contain;
        background-image: url("/charSheet/Rank 5 Icon.png");
    }
</style>
