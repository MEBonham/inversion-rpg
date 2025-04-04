<script>
    import { page } from "$app/stores";
    import { DropdownMenu, Tabs } from "bits-ui";
    import { handleSubmit } from "$lib/utils.js";
    import Button from "$lib/components/Button.svelte";
    import NormalForm from "$lib/components/NormalForm.svelte";
    import QuillEditor from "$lib/components/QuillEditor.svelte";
	import BufferDot from "$lib/components/BufferDot.svelte";

    let quillRef = $state();
    const bindToQuill = (quillInstance) => {
        quillRef = quillInstance;
    }

    let titleInput = $state("");
    let tagsInput = $state("");
    let contents = $state();
    let dbFriendly = $derived(JSON.stringify(contents));

    let selectedPostToEdit = $state(0);
    $effect(() => {
        if (!selectedPostToEdit) {
            titleInput = "";
            tagsInput = "";
            contents = undefined;
        } else {
            const post = $page.data.blogEntries.find((entry) => entry.id === selectedPostToEdit);
            titleInput = post.title;
            tagsInput = post.tags.join(";");
            quillRef.setContents(post.content);
        }
    });
    
    let loading = $state(false);
</script>

<Tabs.Content value="blog">
    <NormalForm method="post" action="?/blogPost" fct={() => handleSubmit(loading)}>
        <input type="hidden" name="editingId" id="editingId" value={selectedPostToEdit} />
        <header>
            <h2>
                Blog Entry
                &middot;
            </h2>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    {#snippet child({ props })}
                        <Button {...props}>
                            (Edit instead)
                        </Button>
                    {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    {#each $page.data.blogEntries as entry}
                        <DropdownMenu.Item>
                            {#snippet child({ props })}
                                <div { ...props } onclick={() => selectedPostToEdit = entry.id}>
                                    {entry.title}
                                </div>
                            {/snippet}
                        </DropdownMenu.Item>
                    {/each}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </header>
        <label for="title">
            <span>Title:</span>
            <input type="text" name="title" id="title" required bind:value={titleInput} />
        </label>
        <label for="tags">
            <span>Tags (semicolon-separated):</span>
            <input type="text" name="tags" id="tags" bind:value={tagsInput} />
        </label>
        <input type="hidden" name="content" id="content" value={dbFriendly} />
        <QuillEditor bind:editor={contents} {bindToQuill} />
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
    header {
        display: flex;
        align-items: center;

        & h2 {
            position: relative;
            top: -0.3rem;
            margin-right: 1.0rem;
        }
    }
</style>
