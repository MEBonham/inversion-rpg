<script>
    import { page } from "$app/stores";
    import { flip } from "svelte/animate";
    import { DropdownMenu, Tabs, Toggle } from "bits-ui";
    import { dragHandleZone, dragHandle } from "svelte-dnd-action";
    import { handleSubmit } from "$lib/utils.js";
    import Button from "$lib/components/Button.svelte";
    import NormalForm from "$lib/components/NormalForm.svelte";
    import QuillEditor from "$lib/components/QuillEditor.svelte";
	import BufferDot from "$lib/components/BufferDot.svelte";
	import DominoHandleIcon from "$lib/components/icons/DominoHandleIcon.svelte";

    let quillRef = $state();
    const bindToQuill = (quillInstance) => {
        quillRef = quillInstance;
    }

    let titleInput = $state("");
    let publishedToggle = $state(true);
    let chapterNumInput = $state("");
    let sectionNumInput = $state("");
    let contents = $state();
    let dbFriendly = $derived(JSON.stringify(contents));

    const flipDurationMs = 100;
    let chaptersCopy = $state($page.data.chapters);
    const handleSort = ({ detail }) => {
        chaptersCopy = detail.items;
    }

    let selectedSectionToEdit = $state(0);
    let postToEditIsOpen = $state(false);
    $effect(() => {
        if (!selectedSectionToEdit) {
            titleInput = "";
            publishedToggle = false;
            chapterNumInput = "";
            sectionNumInput = "";
            if (quillRef) quillRef.setContents([]);
        } else {
            const post = $page.data.rulesSummaries.find((entry) => entry.id === selectedSectionToEdit);
            titleInput = post.title;
            publishedToggle = post.is_public;
            chapterNumInput = post.chapter_num;
            sectionNumInput = post.section_num;
            quillRef.setContents(post.content);
        }
    });
    
    let loading = $state(false);
</script>

<Tabs.Content value="howToPlay">
    <section id="chapterMod">
        <header>
            <h2>Chapters Structure</h2>
        </header>
        <section use:dragHandleZone="{{ items: chaptersCopy, flipDurationMs }}" onconsider="{handleSort}" onfinalize="{handleSort}">
            {#each chaptersCopy as chapter, index (chapter.id)}
                <article animate:flip="{{ duration: flipDurationMs }}">
                    <div use:dragHandle aria-label="drag-handle for {chapter.title}">
                        <DominoHandleIcon size="1.2rem" />
                    </div>
                    <strong>{index + 1}</strong>
                    <input type="text" name="title" required bind:value={chaptersCopy[index].title} />
                    <div class="chapterId">{chapter.id}</div>
                </article>
            {/each}
        </section>
        <footer>
            <Button onclick={() => { chaptersCopy = [...chaptersCopy, { id: Math.random(), title: "New Chapter" }] }}>
                New Chapter
            </Button>
            <form method="post" action="?/saveChapters" fct={() => handleSubmit(loading)}>
                <input type="hidden" name="chapters" id="chapters" value={JSON.stringify(chaptersCopy)} />
                <Button type="submit">Save</Button>
            </form>
        </footer>
    </section>

    <NormalForm method="post" action="?/rulesSectionPost" fct={() => handleSubmit(loading)}>
        <input type="hidden" name="editingId" id="editingId" value={selectedSectionToEdit} />
        <header class="quillEditorSection">
            <h2>
                Rules Section
                &middot;
            </h2>
            <DropdownMenu.Root bind:open={postToEditIsOpen}>
                <DropdownMenu.Trigger>
                    {#snippet child({ props })}
                        <Button {...props}>
                            (Edit instead)
                        </Button>
                    {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="adminPage">
                    <DropdownMenu.Item>
                        {#snippet child({ props })}
                            <div {...props} onclick={() => { selectedSectionToEdit = 0; postToEditIsOpen = false; }}>(New)</div>
                        {/snippet}
                    </DropdownMenu.Item>
                    {#each $page.data.rulesSummaries as section}
                        <DropdownMenu.Item>
                            {#snippet child({ props })}
                                <div { ...props } onclick={() => { selectedSectionToEdit = section.id; postToEditIsOpen = false; }}>
                                    {`Ch. ${section.chapter_num}.${section.section_num}: ${section.title}`}
                                </div>
                            {/snippet}
                        </DropdownMenu.Item>
                    {/each}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </header>
        <div class="twoColumn">
            <label for="title">
                <span>Title:</span>
                <input type="text" name="title" id="title" required bind:value={titleInput} />
            </label>
            <input type="hidden" name="public" id="public" bind:value={publishedToggle} />
            <Toggle.Root bind:pressed={publishedToggle}>
                {#snippet child({ props })}
                    <Button {...props} id="publishedToggle">
                        <span>{publishedToggle ? "Published" : "Hidden"}</span>
                    </Button>
                {/snippet}
            </Toggle.Root>
        </div>
        <div class="twoColumn">
            <label for="chapterNum">
                <span>Chapter:</span>
                <input type="number" name="chapterNum" id="chapterNum" bind:value={chapterNumInput} required />
            </label>
            <label for="sectionNum">
                <span>Section:</span>
                <input type="number" name="sectionNum" id="sectionNum" bind:value={sectionNumInput} required />
            </label>
        </div>
        <input type="hidden" name="content" id="content" value={dbFriendly} />
        <QuillEditor bind:editor={contents} {bindToQuill} index="rulesSummary" />
        {#if $page.form?.src === "blogPost"}
            <p class={$page.form.isError ? "warning" : ""}>
                {$page.form.message || "ERROR: Something went wrong."}
            </p>
        {/if}
        <footer>
            <Button type="submit" disabled={loading}>
                {loading ? "Loading ..." : "Post"}
            </Button>
        </footer>
    </NormalForm>
</Tabs.Content>

<style>
    section#chapterMod {
        margin-bottom: 1.2rem;
        padding: 0 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;

        & > section {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;

            & article {
                padding: 0.2rem 1.2rem;
                border-radius: 0.6rem;
                box-shadow: 0 0 0.6rem var(--boldTorquoise);
                display: flex;
                gap: 1.2rem;
                align-items: center;
    
                & input {
                    background-color: ivory;
                    border-radius: 0.4rem;
                    padding: 0.2rem 0.6rem;
                    color: var(--invertParchment);
                }
                div.chapterId {
                    opacity: 0;
                }
            }
        }
        & footer {
            margin-top: 1.2rem;
            display: flex;
            justify-content: space-between;
        }
    }

    div.twoColumn {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 7.2rem;

        & label {
            flex-grow: 1;
        }
    }

    header.quillEditorSection {
        display: flex;
        align-items: center;

        & h2 {
            position: relative;
            top: -0.3rem;
            margin-right: 1.0rem;
        }
    }
</style>
