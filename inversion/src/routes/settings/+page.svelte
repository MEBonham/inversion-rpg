<script>
    import Button from "$lib/components/Button.svelte";
    import NormalPage from "$lib/components/NormalPage.svelte";

    let { data } = $props();
    let session = $derived(data.session);
    let profile = $derived(data.profile);
    let loading = $state(false);
</script>

<NormalPage title={`Welcome, ${profile?.username || session?.user?.email || "guest"}!`}>
    {#if session}
        <section>
            <h2>Logout</h2>
            <form method="post" action="?/logout">
                <Button type="submit" disabled={loading}>
                    {loading ? "Loading ..." : "Logout"}
                </Button>
            </form>
        </section>
    {/if}
</NormalPage>
    