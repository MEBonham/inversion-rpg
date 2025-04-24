<script>
    import NormalPage from "$lib/components/NormalPage.svelte";
    import QuillEditor from "$lib/components/QuillEditor.svelte";
    import ChapterNavWidget from "./ChapterNavWidget.svelte";

    let { data } = $props();
    let chapterIndex = $derived(data.activeChapter.chapter_num);
</script>

<NormalPage title={`${data.activeChapter.chapter_num}) ${data.activeChapter.title}`}>
    <header>
        <ChapterNavWidget {chapterIndex} numChapters={data.chapters.length} />
    </header>

    {#each data.rulesSummaries as rulesSection}
        <section>
            <header>
                <h2>{rulesSection.title}</h2>
            </header>
            <QuillEditor editor={rulesSection.content} readOnly toolbarOptions={null} index={rulesSection.id} />
        </section>
    {/each}

    <footer>
        <ChapterNavWidget {chapterIndex} numChapters={data.chapters.length} />
    </footer>
</NormalPage>
