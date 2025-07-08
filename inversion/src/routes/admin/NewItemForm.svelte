<script>
    import { page } from "$app/stores";
    import { Checkbox, DropdownMenu, Label } from "bits-ui";
    import { handleSubmit, sleep } from "$lib/utils";
    import { ITEM_CATEGORIES, ARMOR_TYPES, SHIELD_TYPES, WEAPON_TYPES, GUN_TYPES } from "$lib/constants";
    import NormalForm from "$lib/components/NormalForm.svelte";
    import Button from "$lib/components/Button.svelte";
    import CheckboxTrueIcon from "$lib/components/icons/CheckboxTrueIcon.svelte";
    import CheckboxFalseIcon from "$lib/components/icons/CheckboxFalseIcon.svelte";

    let { action, closeDialog } = $props();

    let itemCategory = $state(null);
    let itemCategoryMenuOpen = $state(false);
    let typeMenuOpen = $state(false);
    
    let costSilver = $state(null);
    let carrySpaces = $state(null);
    let type = $state(null);
    let isAdvancedGrade = $state(false);
    let isRanged = $state(false);
    let dodgeMod = $state(null);
    let armorMod = $state(null);
    let speedMod = $state(null);
    let closeRange = $state(null);
    let range = $state(null);
    let itemLoad = $state(null);
    let property = $state(null);
    let weaponDamage = $state(null);
    let weaponCrit = $state(null);
    let itemDescription = $state({});
    let mountSize = $state(null);
    let mountSpeed = $state(null);
    let mountLoyalty = $state(null);
    let techLevel = $state(null);
    let attuneSpCost = $state(null);

    let grade = $derived.by(() => {
        if (itemCategory === "Armor" && isAdvancedGrade) {
            return "Masterwork";
        } else if (itemCategory === "Armor") {
            return null;
        } else if (itemCategory === "Weapon" && isAdvancedGrade) {
            return "Skilled";
        } else if (itemCategory === "Weapon") {
            return "Simple";
        } else {
            return null;
        }
    });

    let loading = $state(false);
    const cleanupSubmit = async () => {
        await sleep(0.1);
        closeDialog();
    }
</script>

<NormalForm method="post" {action} fct={() => handleSubmit(loading, cleanupSubmit)}>
    {#if !itemCategory}
        <DropdownMenu.Root bind:open={itemCategoryMenuOpen}>
            <DropdownMenu.Trigger>
                {#snippet child({ props })}
                    <Button {...props}>
                        Select Item Category
                    </Button>
                {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {#each ITEM_CATEGORIES as category}
                    <DropdownMenu.Item>
                        {#snippet child({ props })}
                            <div { ...props } onclick={() => { itemCategory = category; itemCategoryMenuOpen = false; }}>
                                {category}
                            </div>
                        {/snippet}
                    </DropdownMenu.Item>
                {/each}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    {:else if itemCategory === "Armor"}
        <label for="name">
            <span>Armor Name:</span>
            <input type="text" name="item_name" id="item_name" required />
        </label>
        <DropdownMenu.Root bind:open={typeMenuOpen}>
            <DropdownMenu.Trigger>
                {#snippet child({ props })}
                    <Button {...props}>
                        {type || "Select Armor Type"}
                    </Button>
                {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {#each ARMOR_TYPES as armorType}
                    <DropdownMenu.Item>
                        {#snippet child({ props })}
                            <div { ...props } onclick={() => { type = armorType; typeMenuOpen = false; }}>
                                {armorType}
                            </div>
                        {/snippet}
                    </DropdownMenu.Item>
                {/each}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
        <div>
            <Checkbox.Root bind:checked={isAdvancedGrade}>
                {#snippet children({ checked })}
                    {#if checked}
                        <CheckboxTrueIcon size="2.0rem" />
                    {:else}
                        <CheckboxFalseIcon size="2.0rem" />
                    {/if}                
                {/snippet}
            </Checkbox.Root>
            <Label.Root for="isAdvancedGrade">Masterwork?</Label.Root>
        </div>
        <label for="dodge_mod">
            <span>Dodge Modifier:</span>
            <input type="number" name="dodge_mod" id="dodge_mod" bind:value={dodgeMod} />
        </label>
        <label for="armor_mod">
            <span>Armor Modifier:</span>
            <input type="number" name="armor_mod" id="armor_mod" bind:value={armorMod} />
        </label>
        <label for="speed_mod">
            <span>Speed Modifier:</span>
            <input type="number" name="speed_mod" id="speed_mod" bind:value={speedMod} />
        </label>
        <label for="property">
            <span>Property:</span>
            <input type="text" name="property" id="property" bind:value={property} />
        </label>
    {:else if itemCategory === "Shield"}
        <label for="name">
            <span>Shield Name:</span>
            <input type="text" name="item_name" id="item_name" required />
        </label>
        <DropdownMenu.Root bind:open={typeMenuOpen}>
            <DropdownMenu.Trigger>
                {#snippet child({ props })}
                    <Button {...props}>
                        {type || "Select Shield Type"}
                    </Button>
                {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {#each SHIELD_TYPES as shieldType}
                    <DropdownMenu.Item>
                        {#snippet child({ props })}
                            <div { ...props } onclick={() => { type = shieldType; typeMenuOpen = false; }}>
                                {shieldType}
                            </div>
                        {/snippet}
                    </DropdownMenu.Item>
                {/each}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
        <label for="dodge_mod">
            <span>Dodge Modifier:</span>
            <input type="number" name="dodge_mod" id="dodge_mod" bind:value={dodgeMod} />
        </label>
        <label for="armor_mod">
            <span>Armor Modifier:</span>
            <input type="number" name="armor_mod" id="armor_mod" bind:value={armorMod} />
        </label>
        <label for="speed_mod">
            <span>Speed Modifier:</span>
            <input type="number" name="speed_mod" id="speed_mod" bind:value={speedMod} />
        </label>
        <label for="property">
            <span>Property:</span>
            <input type="text" name="property" id="property" bind:value={property} />
        </label>
    {:else if itemCategory === "Weapon"}
        <label for="name">
            <span>Weapon Name:</span>
            <input type="text" name="item_name" id="item_name" required />
        </label>
        <DropdownMenu.Root bind:open={typeMenuOpen}>
            <DropdownMenu.Trigger>
                {#snippet child({ props })}
                    <Button {...props}>
                        {type || "Select Weapon Type"}
                    </Button>
                {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {#each WEAPON_TYPES as weaponType}
                    <DropdownMenu.Item>
                        {#snippet child({ props })}
                            <div { ...props } onclick={() => { type = weaponType; typeMenuOpen = false; }}>
                                {weaponType}
                            </div>
                        {/snippet}
                    </DropdownMenu.Item>
                {/each}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
        <div>
            <Checkbox.Root bind:checked={isAdvancedGrade}>
                {#snippet children({ checked })}
                    {#if checked}
                        <CheckboxTrueIcon size="2.0rem" />
                    {:else}
                        <CheckboxFalseIcon size="2.0rem" />
                    {/if}                
                {/snippet}
            </Checkbox.Root>
            <Label.Root for="isAdvancedGrade">Skilled?</Label.Root>
        </div>
        <div>
            <input type="hidden" name="is_ranged" id="is_ranged" bind:value={isRanged} />
            <Checkbox.Root bind:checked={isRanged}>
                {#snippet children({ checked })}
                    {#if checked}
                        <CheckboxTrueIcon size="2.0rem" />
                    {:else}
                        <CheckboxFalseIcon size="2.0rem" />
                    {/if}                
                {/snippet}
            </Checkbox.Root>
            <Label.Root for="isRanged">Ranged?</Label.Root>
        </div>
        <label for="weapon_damage">
            <span>Damage:</span>
            <input type="text" name="weapon_damage" id="weapon_damage" bind:value={weaponDamage} placeholder="+3 Slashing" />
        </label>
        <label for="weapon_crit">
            <span>Crit:</span>
            <input type="text" name="weapon_crit" id="weapon_crit" bind:value={weaponCrit} placeholder="+2d8" />
        </label>
        <label for="range">
            <span>Range:</span>
            <input type="number" name="range" id="range" bind:value={range} disabled={!isRanged} />
        </label>
        <label for="property">
            <span>Property:</span>
            <input type="text" name="property" id="property" bind:value={property} />
        </label>
    {:else if itemCategory === "Gun"}
        <label for="name">
            <span>Gun Name:</span>
            <input type="text" name="item_name" id="item_name" required />
        </label>
        <DropdownMenu.Root bind:open={typeMenuOpen}>
            <DropdownMenu.Trigger>
                {#snippet child({ props })}
                    <Button {...props}>
                        {type || "Select Gun Type"}
                    </Button>
                {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {#each GUN_TYPES as gunType}
                    <DropdownMenu.Item>
                        {#snippet child({ props })}
                            <div { ...props } onclick={() => { type = gunType; typeMenuOpen = false; }}>
                                {gunType}
                            </div>
                        {/snippet}
                    </DropdownMenu.Item>
                {/each}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
        <label for="item_load">
            <span>Item Load:</span>
            <input type="text" name="item_load" id="item_load" bind:value={itemLoad} />
        </label>
        <label for="weapon_damage">
            <span>Damage:</span>
            <input type="text" name="weapon_damage" id="weapon_damage" bind:value={weaponDamage} placeholder="D8 Piercing" />
        </label>
        <label for="weapon_crit">
            <span>Crit:</span>
            <input type="text" name="weapon_crit" id="weapon_crit" bind:value={weaponCrit} placeholder="+2d8" />
        </label>
        <label for="close_range">
            <span>Close Range:</span>
            <input type="number" name="close_range" id="close_range" bind:value={closeRange} />
        </label>
        <label for="range">
            <span>Range:</span>
            <input type="number" name="range" id="range" bind:value={range} />
        </label>
        <label for="property">
            <span>Property:</span>
            <input type="text" name="property" id="property" bind:value={property} />
        </label>
    {/if}
    {#if itemCategory}
        <label for="carry_spaces">
            <span>Carry Spaces:</span>
            <input type="number" name="carry_spaces" id="carry_spaces" bind:value={carrySpaces} />
        </label>
        <label for="costSilver">
            <span>Cost in Silver:</span>
            <input type="number" name="cost_silver" id="cost_silver" bind:value={costSilver} />
        </label>
        <input type="hidden" name="item_category" id="item_category" value={itemCategory} />
        <input type="hidden" name="grade" id="grade" value={grade} />
        <input type="hidden" name="type" id="type" value={type} />
        <footer>
            <Button onclick={closeDialog}>Cancel</Button>
            <Button type="submit" disabled={loading}>
                {loading ? "Loading ..." : "Save"}
            </Button>
        </footer>
    {/if}
</NormalForm>

<style>
    div {
        display: flex;
        gap: 0.6rem;
    }

    input::placeholder {
        opacity: 0.6;
    }
</style>
