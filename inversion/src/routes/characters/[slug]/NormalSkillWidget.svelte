<script>
	import NormalDialog from "$lib/components/NormalDialog.svelte";
    import { ContextMenu, Dialog } from "bits-ui";
    import Button from "$lib/components/Button.svelte";
    import EditSkillForm from "./EditSkillForm.svelte";

    let { hasEditPermission, skill } = $props();
    const range = [1, 2, 3, 4, 5];

    let skillDialogOpen = $state(false);
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
                        {#each range as rank, index}
                            <div class="bubble" class:filled={rank <= skill.rank}></div>
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
        <EditSkillForm action="?/saveSkill" {skill} closeDialog={() => skillDialogOpen = false} />
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
            top: 0.2rem;
            width: calc(30% - 0.3rem);
            margin: 0;
            text-align: right;
            font-size: 1.4rem;
        }
        & .body {
            width: calc(70% - 0.3rem);
            display: flex;
            justify-content: space-between;

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
</style>
