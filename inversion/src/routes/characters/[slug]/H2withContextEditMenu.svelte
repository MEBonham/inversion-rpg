<script>
    import { ContextMenu, Dialog } from "bits-ui";

    let { mappedSelections, hasEditPermission, singularTitle, pluralTitle, focusFct } = $props();
</script>

<ContextMenu.Root>
    <ContextMenu.Trigger>
        {#snippet child({ props })}
            <h2 {...props}>
                <span>{(mappedSelections.length > 1 ? pluralTitle : singularTitle).toUpperCase()}:</span>
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
                    <Dialog.Trigger onclick={focusFct}>
                        Edit {pluralTitle}
                    </Dialog.Trigger>
                </ContextMenu.Item>
            </ContextMenu.Content>
        </ContextMenu.Portal>
    {/if}
</ContextMenu.Root>

<style>
    h2 {
        cursor: pointer;
    }
</style>
