<script>
	import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { enhance } from "$app/forms";
    import { DropdownMenu } from "bits-ui";
    import { handleSubmit, sleep } from "$lib/utils";
	import BufferDot from "$lib/components/BufferDot.svelte";
    import Button from "$lib/components/Button.svelte";
    import NormalForm from "$lib/components/NormalForm.svelte";
    import TrashIcon from "$lib/components/icons/TrashIcon.svelte";

    let { action, closeDialog } = $props();
    let allBackgrounds = $state([]);
    let backgrounds = $state(
        $page.data.character.character_backgrounds.map((obj) => obj.backgrounds)
    );
    let selectNewBackgroundOpen = $state(false);
    onMount(async () => {
        const jsonRes = await fetch("/api/v1/fetchChoices/backgrounds");
        if (jsonRes.ok) {
            allBackgrounds = await jsonRes.json();
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
    <input type="hidden" name="backgrounds" id="backgrounds" value={JSON.stringify(backgrounds)} />
    <ul>
        {#each backgrounds as background, index}
            <li>
                <button class="warning" type="button" onclick={() => backgrounds.splice(index, 1)}>
                    <TrashIcon size="1.6rem" />
                </button>
                <BufferDot />
                <span>{background.background_name}</span>
            </li>
        {/each}
        <li>
            <span class="needsBufferSpace">Add Background:</span>
            <DropdownMenu.Root bind:open={selectNewBackgroundOpen}>
                <DropdownMenu.Trigger>
                    {#snippet child({ props })}
                        <Button {...props}>
                            (None)
                        </Button>
                    {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    {#each allBackgrounds.filter((background) => !backgrounds.find((existingBackground) => existingBackground.id === background.id)) as background}
                        <DropdownMenu.Item>
                            {#snippet child({ props })}
                                <div { ...props } onclick={() => {
                                    backgrounds.push(background);
                                    selectNewBackgroundOpen = false;
                                }}>
                                    {background.background_name}
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
