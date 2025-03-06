<script>
    import { onMount } from "svelte";
    
    const defaultOptions = [
        [{ header: 3 }, "blockquote", "link", "image"],
		["bold", "italic", "strike"],
		[{ list: "bullet" }, { list: "ordered" }],
		[{ align: [] }],
		["clean"]
    ];
    
    let {
        editor=$bindable(),
        toolbarOptions=defaultOptions,
        readOnly=false,
        index="",
        editingPrevious=false,
    } = $props();

    const id = index !== "" ? `editor-${index}` : "editor";
    onMount(async () => {
        const { default: Quill } = await import("quill");
        let quill = new Quill(`#${id}`, {
            readOnly,
            modules: {
                toolbar: toolbarOptions,
            },
            theme: "snow",
        });
        
        if (readOnly && editor) {
            quill.setContents(editor);
            document.querySelector(`#${id} .ql-editor`).style.setProperty("padding-top", "0.2rem");
        } else {
            if (editingPrevious) {
                quill.setContents(editor);
            }
            quill.on("text-change", () => editor = quill.getContents());
            return () => quill.off("text-change");
        }
    });
</script>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" />
</svelte:head>

<div class={`editor-wrapper ${readOnly ? "borderFree" : "editable"}`}>
    <div id={id}></div>
</div>

<style>
    div.editor-wrapper.editable {
        background-color: ivory;
        color: var(--consistentDark);

        & :global(div.ql-container) {
            min-height: 12rem;
        }
    }
    :global(div.borderFree div.ql-container) {
        border: none;
    }
</style>
