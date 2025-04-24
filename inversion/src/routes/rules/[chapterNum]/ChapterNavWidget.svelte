<script>
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { Button as BitsButton, DropdownMenu } from "bits-ui";
    import Button from "$lib/components/Button.svelte";

    let prevChapter = $derived((($page.data.chapterNum - 1 + $page.data.chapters.length) % $page.data.chapters.length) || $page.data.chapters.length);
    let nextChapter = $derived((($page.data.chapterNum + 1) % $page.data.chapters.length) || $page.data.chapters.length);
    let prevChapterTitle = $derived($page.data.chapters.find((chapter) => chapter.chapter_num === prevChapter).title);
    let nextChapterTitle = $derived($page.data.chapters.find((chapter) => chapter.chapter_num === nextChapter).title);

    let menuOpen = $state(false);
    const handleNavClick = (chapterNum) => {
        goto(`/rules/${chapterNum}/`);
        menuOpen = false;
    }
</script>

<nav>
    <BitsButton.Root href={`/rules/${prevChapter}`}>Prev: {prevChapterTitle}</BitsButton.Root>
    <DropdownMenu.Root bind:open={menuOpen}>
        <DropdownMenu.Trigger>
            {#snippet child({ props })}
                <Button {...props}>
                    {`${$page.data.chapterNum}) ${$page.data.activeChapter.title}`}
                </Button>
            {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            {#each $page.data.chapters.sort((a, b) => a.chapter_num - b.chapter_num) as chapter}
                <DropdownMenu.Item>
                    {#snippet child({ props })}
                        <button {...props} onclick={() => handleNavClick(chapter.chapter_num)}>
                            {`${chapter.chapter_num}) ${chapter.title}`}
                        </button>
                    {/snippet}
                </DropdownMenu.Item>
            {/each}
        </DropdownMenu.Content>
    </DropdownMenu.Root>
    <BitsButton.Root href={`/rules/${nextChapter}`}>Next: {nextChapterTitle}</BitsButton.Root>
</nav>

<style>
    nav {
        margin: 1.2rem 0;
        width: 100%;
        display: flex;
        align-items: center;
        gap: 1.2rem;
    }
</style>
