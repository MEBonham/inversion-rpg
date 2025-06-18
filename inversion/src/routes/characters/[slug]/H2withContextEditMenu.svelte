<script>
    import { ContextMenu, Dialog } from "bits-ui";

    let { mappedSelections, hasEditPermission, singularTitle, pluralTitle } = $props();
</script>

<ContextMenu.Root>
    <ContextMenu.Trigger>
        {#snippet child({ props })}
            <h2 {...props}>
                <span>{mappedSelections.length > 1 ? pluralTitle : singularTitle}:</span>
                {#each mappedSelections as selection, index}
                    {#if index !== 0}
                        <span>, </span>
                    {/if}
                    <span>{selection}</span>
                {/each}
            </h2>
        {/snippet}
    </ContextMenu.Trigger>
    {#if hasEditPermission}
        <ContextMenu.Portal to="#page" class="myContextMenu">
            <ContextMenu.Content>
                <ContextMenu.Item>
                    <Dialog.Trigger onclick={() => whichDialog = pluralTitle}>
                        Edit Backgrounds
                    </Dialog.Trigger>
                </ContextMenu.Item>
            </ContextMenu.Content>
        </ContextMenu.Portal>
    {/if}
</ContextMenu.Root>
