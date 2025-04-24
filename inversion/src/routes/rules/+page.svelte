<script>
    import NormalPage from "$lib/components/NormalPage.svelte";

    let { data } = $props();
</script>

<NormalPage title="Rules: Table of Contents">
    <header>
        <h2>Chapters</h2>
    </header>
    <ol>
        {#each data.chapters as chapter}
            <li>
                <a href="/rules/{chapter.chapter_num}">{chapter.title}</a>
            </li>
        {/each}
    </ol>
</NormalPage>

<style>
    ol {
        margin: 1.0rem 0 1.0rem 3.4rem;
        line-height: 1.5;
        list-style: decimal;
    }
</style>
