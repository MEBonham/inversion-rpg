<script>
    import { page } from "$app/stores";
    import { DropdownMenu, RadioGroup } from "bits-ui";
    import { handleSubmit, sleep } from "$lib/utils";
    import { CREATURE_SIZE_OPTIONS, CREATURE_SPEED_OPTIONS } from "$lib/constants";
    import NormalForm from "$lib/components/NormalForm.svelte";
    import Button from "$lib/components/Button.svelte";
	import BufferDot from "$lib/components/BufferDot.svelte";
	import PlusIcon from "$lib/components/icons/PlusIcon.svelte";

    let { action, closeDialog } = $props();

    let selectedNativeLanguage = $state(null);
    let languagesMenuOpen = $state(false);
    let stamina = $state({
        base: 20,
        initialDiceNum: 2,
        initialDiceSides: 6,
        extraDiceNum: 1,
        extraDiceSides: 6,
    });
    let selectedSize = $state("Medium");
    let sizesMenuOpen = $state(false);
    let selectedSpeed = $state("5");
    let traits = $state([
        { name: "Trait Name", value: "Description" },
        { name: "Trait Name", value: "Description" },
    ]);
    let dbFriendlyTraits = $derived(JSON.stringify(
        traits.filter((trait) => trait.name || trait.value)
    ));

    let loading = $state(false);
    const cleanupSubmit = async () => {
        await sleep(0.1);
        closeDialog();
    }
</script>

<NormalForm method="post" {action} fct={() => handleSubmit(loading, cleanupSubmit)}>
    <label for="name">
        <span>Ancestry Name:</span>
        <input type="text" name="name" id="name" required />
    </label>
    <label for="nativeLanguage">
        <span>Native Language:</span>
        <input type="hidden" name="nativeLanguage" id="nativeLanguage" value={selectedNativeLanguage} />
        <DropdownMenu.Root bind:open={languagesMenuOpen}>
            <DropdownMenu.Trigger>
                {#snippet child({ props })}
                    <Button {...props}>
                        {selectedNativeLanguage || "(None)"}
                    </Button>
                {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item>
                    {#snippet child({ props })}
                        <div {...props} onclick={() => { selectedNativeLanguage = null; languagesMenuOpen = false; }}>(None)</div>
                    {/snippet}
                </DropdownMenu.Item>
                {#each $page.data.languages.filter((language) => language.language_name !== "Common") as language}
                    <DropdownMenu.Item>
                        {#snippet child({ props })}
                            <div { ...props } onclick={() => { selectedNativeLanguage = language.id; languagesMenuOpen = false; }}>
                                {language.language_name}
                            </div>
                        {/snippet}
                    </DropdownMenu.Item>
                {/each}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </label>
    <label for="stamina">
        <span>Stamina:</span>
        <span>
            <input class="mini" type="number" name="baseStamina" id="baseStamina" bind:value={stamina.base} />
            +
            <input class="mini" type="number" name="initialDiceNum" id="initialDiceNum" bind:value={stamina.initialDiceNum} />
            D
            <input class="mini" type="number" name="initialDiceSides" id="initialDiceSides" bind:value={stamina.initialDiceSides} />
        </span>
    </label>
    <label for="staminaPerHealth">
        <span>Extra Stamina per Health Rank:</span>
        <span>
            <input class="mini" type="number" name="extraDiceNum" id="extraDiceNum" bind:value={stamina.extraDiceNum} />
            D
            <input class="mini" type="number" name="extraDiceSides" id="extraDiceSides" bind:value={stamina.extraDiceSides} />
        </span>
    </label>
    <label for="size">
        <span>Size:</span>
        <input type="hidden" name="size" id="size" value={selectedSize} />
        <DropdownMenu.Root bind:open={sizesMenuOpen}>
            <DropdownMenu.Trigger>
                {#snippet child({ props })}
                    <Button {...props}>
                        {selectedSize || "(None)"}
                    </Button>
                {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {#each CREATURE_SIZE_OPTIONS as size}
                    <DropdownMenu.Item>
                        {#snippet child({ props })}
                            <div { ...props } onclick={() => { selectedSize = size; sizesMenuOpen = false; }}>
                                {size}
                            </div>
                        {/snippet}
                    </DropdownMenu.Item>
                {/each}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </label>
    <label for="speed">
        <span>Speed:</span>
        <RadioGroup.Root name="speed" bind:value={selectedSpeed}>
            {#each CREATURE_SPEED_OPTIONS as speed}
                <div>
                    <RadioGroup.Item value={speed}>
                        {#snippet children({ checked })}
                            {#if checked}
                                <div class="radioDot"></div>
                            {/if}
                        {/snippet}
                    </RadioGroup.Item>
                    <span>{speed}</span>
                </div>
            {/each}
        </RadioGroup.Root>
    </label>
    <section id="traitsEntry">
        <header>
            <h2>
                Traits
                <BufferDot />
                <button type="button" onclick={() => traits.push({ name: "", value: "" })}>
                    <PlusIcon size="1.6rem" />
                </button>
            </h2>
        </header>
        {#each traits as trait, index}
            <label for="traits">
                <input class="name" type="text" bind:value={traits[index].name} />
                <input class="description" type="text" bind:value={traits[index].value} />
            </label>
        {/each}
    </section>
    <section id="ancestryAbilityEntry">
        <h2>Ancestry Ability</h2>

    </section>
</NormalForm>

<style>
    h2 {
        font-family: "Girassol";
        font-size: 2.0rem;
        color: var(--boldTorquoise);
    }

    section#traitsEntry {
        min-width: 65dvw;

        & header {
            display: flex;
            align-items: center;

        }
        & > label {
            display: flex;
            gap: 1.0rem;
        
            input.name {
                flex-grow: 1;
            }
            input.description {
                flex-grow: 10;
            }
        }
    }

    label[for="stamina"],
    label[for="staminaPerHealth"] {
        display: flex;
        gap: 0.6rem;
        
    }
    input.mini {
        max-width: 5.0rem;
        text-align: center;
    }
</style>
