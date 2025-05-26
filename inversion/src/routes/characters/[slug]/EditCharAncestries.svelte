<script>
	import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { DropdownMenu } from "bits-ui";
    import { handleSubmit, sleep } from "$lib/utils";
	import BufferDot from "$lib/components/BufferDot.svelte";
    import Button from "$lib/components/Button.svelte";
    import NormalForm from "$lib/components/NormalForm.svelte";
    import TrashIcon from "$lib/components/icons/TrashIcon.svelte";

    let { action, closeDialog } = $props();
    let allAncestries = $state([]);
    let ancestries = $state(
        $page.data.character.character_ancestries.map((obj) => obj.ancestries)
    );
    let selectNewAncestryOpen = $state(false);
    onMount(async () => {
        const jsonRes = await fetch("/api/v1/fetchChoices/ancestries");
        if (jsonRes.ok) {
            allAncestries = await jsonRes.json();
        }
        loading = false;
    });

    let loading = $state(true);
    const cleanupSubmit = async () => {
        await sleep(0.1);
        closeDialog();
    }
</script>

<NormalForm method="post" {action} fct={() => handleSubmit(loading, cleanupSubmit)}>
    <input type="hidden" name="character_id" id="character_id" value={$page.data.character.id} />
    <input type="hidden" name="ancestries" id="ancestries" value={JSON.stringify(ancestries)} />
    <ul>
        {#each ancestries as ancestry, index}
            <li>
                <button class="warning" type="button" onclick={() => ancestries.splice(index, 1)}>
                    <TrashIcon size="1.6rem" />
                </button>
                <BufferDot />
                <span>{ancestry.ancestry_name}</span>
            </li>
        {/each}
        <li>
            <span class="needsBufferSpace">Add Ancestry:</span>
            <DropdownMenu.Root bind:open={selectNewAncestryOpen}>
                <DropdownMenu.Trigger>
                    {#snippet child({ props })}
                        <Button {...props}>
                            (None)
                        </Button>
                    {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    {#each allAncestries.filter((ancestry) => !ancestries.find((existingAncestry) => existingAncestry.id === ancestry.id)) as ancestry}
                        <DropdownMenu.Item>
                            {#snippet child({ props })}
                                <div { ...props } onclick={() => {
                                    ancestries.push(ancestry);
                                    selectNewAncestryOpen = false;
                                }}>
                                    {ancestry.ancestry_name}
                                </div>
                            {/snippet}
                        </DropdownMenu.Item>
                    {/each}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </li>
    </ul>
    <footer>
        <Button type="submit" disabled={loading}>
            {loading ? "Loading ..." : "Save"}
        </Button>
    </footer>
</NormalForm>

<style>
    span.needsBufferSpace {
        margin-right: 3.0rem;
    }
</style>
