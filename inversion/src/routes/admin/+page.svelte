<script>
    import { Tabs } from "bits-ui";
    import NormalPage from "$lib/components/NormalPage.svelte";
	import Button from "$lib/components/Button.svelte";
    import LibraryAddTab from "./LibraryAddTab.svelte";

    const tools = [
        { title: "Add to Library", value: "lib" },
        { title: "Blog Posts", value: "blog" },
        { title: "How to Play Guide", value: "howToPlay" },
        { title: "Manage Users", value: "userMgt" },
    ];
    let activeTab = $state("lib");
</script>

<NormalPage title="Administration">
    <Tabs.Root class="normal" bind:value={activeTab}>
        <Tabs.List>
            {#each tools as tool}
                <Tabs.Trigger value={tool.value}>
                    {#snippet child({ props })}
                        <Button {...props}>{tool.title}</Button>
                    {/snippet}
                </Tabs.Trigger>
            {/each}
        </Tabs.List>
        <LibraryAddTab />
    </Tabs.Root>
</NormalPage>
