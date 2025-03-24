<script>
    import { page } from "$app/stores";
    import { Checkbox, Label } from "bits-ui";
    import { handleSubmit, sleep } from "$lib/utils.js";
    import NormalForm from "$lib/components/NormalForm.svelte";
    import Button from "$lib/components/Button.svelte";
    import CheckboxTrueIcon from "$lib/components/icons/CheckboxTrueIcon.svelte";
    import CheckboxFalseIcon from "$lib/components/icons/CheckboxFalseIcon.svelte";

    let { editingId, action, closeDialog } = $props();
    let isRumorChecked = $state(false);
    let isTrueRumorChecked = $state(true);

    let loading = $state(false);
    const cleanupSubmit = async () => {
        await sleep(0.1);
        closeDialog();
    }
</script>

<NormalForm method="post" {action} fct={() => handleSubmit(loading, cleanupSubmit)}>
    <input type="hidden" name="editingId" id="editingId" value={editingId} />
    <input type="hidden" name="isRumor" id="isRumor" value={isRumorChecked} />
    <input type="hidden" name="isTrueRumor" id="isTrueRumor" value={isTrueRumorChecked} />
    <div>
        <Checkbox.Root id="isRumor" bind:checked={isRumorChecked}>
            {#snippet children({ checked })}
                {#if checked}
                    <CheckboxTrueIcon size="2.0rem" />
                {:else}
                    <CheckboxFalseIcon size="2.0rem" />
                {/if}                
            {/snippet}
        </Checkbox.Root>
        <Label.Root for="isRumor">Is Rumor?</Label.Root>
    </div>
    <div>
        <Checkbox.Root id="isTrueRumor" bind:checked={isTrueRumorChecked} disabled={!isRumorChecked}>
            {#snippet children({ checked })}
                {#if checked}
                    <CheckboxTrueIcon size="2.0rem" />
                {:else}
                    <CheckboxFalseIcon size="2.0rem" />
                {/if}                
            {/snippet}
        </Checkbox.Root>
        <Label.Root for="isTrueRumor">
            <span>Is <em>True</em> Rumor?</span>
        </Label.Root>
    </div>
    <label for="rumorSummary">
        <span>Summary:</span>
        <input type="text" name="rumorSummary" id="rumorSummary" required />
    </label>
    <label for="rumorDetails">
        <span>Details (optional):</span>
        <input type="text" name="rumorDetails" id="rumorDetails" />
    </label>
    {#if ["addRumor"].includes($page.form?.src) }
        <p class={$page.form.isError ? "warning" : ""}>
            {$page.form.message || "ERROR: Something went wrong."}
        </p>
    {/if}
    <footer>
        <Button type="submit" disabled={loading}>
            {loading ? "Loading ..." : "Save"}
        </Button>
    </footer>
</NormalForm>

<style>
    div {
        display: flex;
        align-items: center;
    }
</style>
