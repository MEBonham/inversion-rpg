<script>
    import NormalPage from "$lib/components/NormalPage.svelte";
    import BlogArticle from "./BlogArticle.svelte";

    let { data } = $props();
</script>

<NormalPage title="Inversion Blog">
    {#each data.blogs as blog, index}
        <BlogArticle {blog} {index} />
    {/each}
</NormalPage>
