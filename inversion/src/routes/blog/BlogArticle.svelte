<script>
    import { Collapsible } from "bits-ui";
    import { DateTime } from "luxon";

    import BufferDot from "$lib/components/BufferDot.svelte";
    import TriangleOpenerIcon from "$lib/components/icons/TriangleOpenerIcon.svelte";
    import QuillEditor from "$lib/components/QuillEditor.svelte";

    let { blog, index } = $props();
    let headerIsOpen = $state(false);
</script>

<article>
    <header>
        <Collapsible.Root>
            <Collapsible.Trigger class="clickable blogTitle">
                {#snippet child({ props })}
                    <h2 {...props}>
                        <TriangleOpenerIcon />
                        {blog.title}
                    </h2>
                {/snippet}
            </Collapsible.Trigger>
            <Collapsible.Content>
                <h3>{blog.author_label}<BufferDot />{DateTime.fromISO(blog.created_at).toLocaleString(DateTime.DATETIME_MED)}</h3>
                {#if blog.tags.length > 0}
                    <p><strong>Tags:</strong> {blog.tags.join(", ")}</p>
                {/if}
            </Collapsible.Content>
        </Collapsible.Root>
    </header>
    <QuillEditor editor={blog.content} readOnly toolbarOptions={null} {index} />
</article>

<style>
    article {
        margin: 0.8rem 0 2.4rem;

        & header {
            padding: 0.2rem 1.0rem 0.4rem;
            border-radius: 0.4rem;
            background-color: var(--sectionBubble);

            & :global(svg) {
                position: relative;
                top: -0.3rem;
                transition: transform 0.2s linear;
            }
            & :global(h2[data-state=open] svg) {
                transform: rotate(90deg);
            }
            & h3 {
                margin-left: 1.8rem;
            }
            & p {
                margin: 0 0 0.4rem 1.8rem;
            }
        }
    }
</style>
