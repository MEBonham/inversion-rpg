<script>
    import { page } from "$app/stores";
    import { handleSubmit, sleep } from "$lib/utils";
	import NormalDialog from "$lib/components/NormalDialog.svelte";
	import NormalForm from "$lib/components/NormalForm.svelte";
    import Button from "$lib/components/Button.svelte";
    import { ContextMenu, Dialog, DropdownMenu } from "bits-ui";

    let speed = $derived.by(() => {
        return $page.data.character.speed
            || Math.min($page.data.character.character_ancestries.map((ancestry) => ancestry.ancestries.speed))
            || 4;
    });
    let currentSpeed = $derived($page.data.character.current_speed ?? speed);

    let stamina = $derived.by(() => {
        return $page.data.character.stamina
            || Math.min($page.data.character.character_ancestries.map((ancestry) => ancestry?.ancestries?.stamina?.base))
            || 20;
    });
    let currentStamina = $derived($page.data.character.current_stamina ?? stamina);

    let dodge = $derived.by(() => {
        return $page.data.character.dodge
            || 0;
    });
    let currentDodge = $derived($page.data.character.current_dodge ?? dodge);

    let armor = $derived.by(() => {
        return $page.data.character.armor
            || 0;
    });
    let currentArmor = $derived($page.data.character.current_armor ?? armor);

    let whichDialog = $state(null);
    let dialogIsOpen = $state(false);
    const dialogTitles = {
        normalSpeed: "Normal Speed",
        currentSpeed: "Current Speed"
    };
    let selectedStatValue = $state(null);

    let loading = $state(false);
    const cleanupSubmit = async () => {
        await sleep(0.1);
        dialogIsOpen = false;
    }
</script>

<Dialog.Root bind:open={dialogIsOpen} onOpenChange={() => selectedStatValue = null}>
    <div id="currentStatsTracking">
        <ContextMenu.Root>
            <ContextMenu.Trigger>
                {#snippet child({ props })} 
                    <article {...props}>
                        <div>
                            <img src="/charSheet/Speed Icon.png" alt="Speed Icon">
                            <span>SP</span>
                            {speed}
                        </div>
                        <div>
                            <span>CURRENT:</span>
                            {currentSpeed}
                        </div>
                    </article>
                {/snippet}
            </ContextMenu.Trigger>
            <ContextMenu.Portal to="#page" class="myContextMenu">
                <ContextMenu.Content>
                    <ContextMenu.Item>
                        <Dialog.Trigger onclick={() => whichDialog = "normalSpeed"}>
                            Select Normal Speed
                        </Dialog.Trigger>
                    </ContextMenu.Item>
                    <ContextMenu.Item>
                        <Dialog.Trigger onclick={() => whichDialog = "currentSpeed"}>
                            Set Current Speed
                        </Dialog.Trigger>
                    </ContextMenu.Item>
                </ContextMenu.Content>
            </ContextMenu.Portal>
        </ContextMenu.Root>
        <article>
            <div>
                <img src="/charSheet/Stamina Icon.png" alt="Stamina Icon">
                <span>STA</span>
                {stamina}
            </div>
            <div>
                <span>CURRENT:</span>
                {currentStamina}
            </div>
        </article>
        <article>
            <div>
                <img src="/charSheet/Dodge Icon.png" alt="Dodge Icon">
                <span>DO</span>
                {dodge}
            </div>
            <div>
                <span>CURRENT:</span>
                {currentDodge}
            </div>
        </article>
        <article>
            <div>
                <img src="/charSheet/Armor Icon.png" alt="Armor Icon">
                <span>AR</span>
                {armor}
            </div>
            <div>
                <span>CURRENT:</span>
                {currentArmor}
            </div>
        </article>
    </div>
    <NormalDialog title={dialogTitles[whichDialog]}>
        {#if whichDialog === "normalSpeed"}
            <NormalForm method="post" action="?/saveColumn" fct={() => handleSubmit(loading, cleanupSubmit)}>
                <input type="hidden" name="character_id" id="character_id" value={$page.data.character.id} />
                <input type="hidden" name="whichColumn" id="whichColumn" value="speed" />
                <input type="hidden" name="value" id="value" value={selectedStatValue} />
                Selected Speed: {selectedStatValue || "none"}
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        {#snippet child({ props })}
                            <Button {...props}>
                                Select Speed
                            </Button>
                        {/snippet}
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        {#if $page.data.character.character_ancestries.length > 0}
                            {#each $page.data.character.character_ancestries as ancestry}
                                <DropdownMenu.Item>
                                    {#snippet child({ props })}
                                        <button {...props} onclick={() => selectedStatValue = ancestry.ancestries.speed} type="button">
                                            {ancestry.ancestries.ancestry_name}:
                                            {ancestry.ancestries.speed}
                                        </button>
                                    {/snippet}
                                </DropdownMenu.Item>
                            {/each}
                        {:else}
                            <DropdownMenu.Item>
                                4
                            </DropdownMenu.Item>
                        {/if}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                <footer>
                    <Button type="submit" disabled={loading}>Save</Button>
                </footer>
            </NormalForm>
        {:else if whichDialog === "currentSpeed"}
            <NormalForm method="post" action="?/saveColumn" fct={() => handleSubmit(loading, cleanupSubmit)}>
                <input type="hidden" name="character_id" id="character_id" value={$page.data.character.id} />
                <input type="hidden" name="whichColumn" id="whichColumn" value="current_speed" />
                <label for="current_speed">
                    <span>Current Speed:</span>
                    <input type="number" name="value" id="value" bind:value={selectedStatValue} required />
                </label>
                <footer>
                    <Button type="submit" disabled={loading}>Save</Button>
                </footer>
            </NormalForm>
        {/if}
    </NormalDialog>
</Dialog.Root>

<style>
    #currentStatsTracking {
        flex-grow: 2;
        padding-left: 3.0rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 0.8rem;

        & article {
            cursor: pointer;

            & div {
                display: flex;
                align-items: center;
                gap: 0.6rem;

                & img {
                    width: 1.6rem;
                    height: 1.6rem;
                }
            }
        }
    }
</style>
