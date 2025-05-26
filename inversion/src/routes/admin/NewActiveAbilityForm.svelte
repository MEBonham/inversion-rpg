<script>
    import { page } from "$app/stores";
    import { Checkbox, Label } from "bits-ui";
    import { handleSubmit, sleep } from "$lib/utils";
    import NormalForm from "$lib/components/NormalForm.svelte";
    import Button from "$lib/components/Button.svelte";
    import QuillEditor from "$lib/components/QuillEditor.svelte";
    import CheckboxTrueIcon from "$lib/components/icons/CheckboxTrueIcon.svelte";
    import CheckboxFalseIcon from "$lib/components/icons/CheckboxFalseIcon.svelte";

    let { action, closeDialog } = $props();

    let anyonesTurnChecked = $state(false);
    let description = $state();
    let dbFriendly = $derived(JSON.stringify(description));

    let loading = $state(false);
    const cleanupSubmit = async () => {
        await sleep(0.1);
        closeDialog();
    }
</script>

<NormalForm method="post" {action} fct={() => handleSubmit(loading, cleanupSubmit)}>
    <label for="name">
        <span>Active Ability Name:</span>
        <input type="text" name="ability_name" id="ability_name" required />
    </label>
    <label for="actionType">
        <span>Action Type:</span>
        <input type="text" name="action_type" id="action_type" required />
    </label>
    <label for="usesPerRest">
        <span>Uses Per Rest (use Zero for at-will):</span>
        <input type="number" name="uses_per_rest" id="uses_per_rest" min="0" required />
    </label>
    <div class="checkboxRow">
        <input type="hidden" name="anyones_turn" id="anyones_turn" value={anyonesTurnChecked} />
        <Checkbox.Root id="anyones_turn" bind:checked={anyonesTurnChecked}>
            {#snippet children({ checked })}
                {#if checked}
                    <CheckboxTrueIcon size="2.0rem" />
                {:else}
                    <CheckboxFalseIcon size="2.0rem" />
                {/if}                
            {/snippet}
        </Checkbox.Root>
        <Label.Root for="anyones_turn">On Anyone's Turn?</Label.Root>
    </div>
    <h3>Description</h3>
    <input type="hidden" name="description" id="description" value={dbFriendly} />
    <QuillEditor bind:editor={description} index="activeAbilityDescription" />
    <footer>
        <Button type="submit" disabled={loading}>
            {loading ? "Loading ..." : "Save"}
        </Button>
    </footer>
</NormalForm>
