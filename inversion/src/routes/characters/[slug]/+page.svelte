<script>
    import NormalPage from "$lib/components/NormalPage.svelte";

    let { data } = $props();
    let character = $derived(data.character);
</script>

<NormalPage title={character.character_name}>
    <p>TODO: character page</p>
</NormalPage>
