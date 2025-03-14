<script>
    import { page } from "$app/stores";
    import { handleSubmit } from "$lib/utils.js";
    import Button from "$lib/components/Button.svelte";
    import NormalForm from "$lib/components/NormalForm.svelte";
    import NormalPage from "$lib/components/NormalPage.svelte";

    let loading = $state(false);
</script>

<NormalPage title="Login / Register">
    <NormalForm method="post" action="?/magicLink" fct={() => handleSubmit(loading)}>
        <label for="email">
            <span>Email:</span>
            <input type="email" name="email" id="email" required />
        </label>
        {#if $page.form?.src === "magicLinkForm"}
            <p class={$page.form.isError ? "warning" : ""}>
                {$page.form.message || "ERROR: Something went wrong."}
            </p>
        {/if}
        <footer>
            <Button type="submit" disabled={loading}>
                {loading ? "Loading ..." : "Send Magic Link"}
            </Button>
        </footer>
    </NormalForm>
</NormalPage>
