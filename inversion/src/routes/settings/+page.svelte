<script>
    import Button from "$lib/components/Button.svelte";
    import NormalPage from "$lib/components/NormalPage.svelte";

    let { data } = $props();
    let session = $derived(data.session);

    let loading = $state(false);
</script>

<NormalPage title={`Welcome, ${session?.user?.user_metadata?.email || "guest"}`} >
    {#if session}
        <section>
            <form method="post" action="?/logout">
                <Button type="submit" disabled={loading}>
                    {loading ? "Loading ..." : "Logout"}
                </Button>
            </form>
        </section>
    {/if}
</NormalPage>
