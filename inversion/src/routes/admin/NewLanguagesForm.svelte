<script>
    import { handleSubmit, sleep } from "$lib/utils";
    import NormalForm from "$lib/components/NormalForm.svelte";
    import Button from "$lib/components/Button.svelte";

    let { action, closeDialog } = $props();

    let loading = $state(false);
    const cleanupSubmit = async () => {
        await sleep(0.1);
        closeDialog();
    }
</script>

<NormalForm method="post" {action} fct={() => handleSubmit(loading, cleanupSubmit)}>
    <label for="name">
        <span>Language Name:</span>
        <input type="text" name="name" id="name" required />
    </label>
    <label for="description">
        <span>Description:</span>
        <input type="text" name="description" id="description" required />
    </label>
    <footer>
        <Button onclick={closeDialog}>Cancel</Button>
        <Button type="submit" disabled={loading}>
            {loading ? "Loading ..." : "Save"}
        </Button>
    </footer>
</NormalForm>
