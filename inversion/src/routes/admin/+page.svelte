<script>
    import { Tabs } from "bits-ui";
    import NormalPage from "$lib/components/NormalPage.svelte";
	import Button from "$lib/components/Button.svelte";
    import LibraryAddTab from "./LibraryAddTab.svelte";
    import BlogPostAdd from "./BlogPostAdd.svelte";
    import RulesSummaryAddEdit from "./RulesSummaryAddEdit.svelte";

    const tools = [
        { title: "Blog Posts", value: "blog" },
        { title: "Add to Library", value: "lib" },
        { title: "How to Play Guide", value: "howToPlay" },
        { title: "Manage Users", value: "userMgt" },
    ];
    let activeTab = $state("blog");
    $effect(() => {
        if (window.localStorage.getItem("inversion-rpg-admin-activeTab") !== null) {
            activeTab = window.localStorage.getItem("inversion-rpg-admin-activeTab");
        }
    });
    $effect(() => {
        window.localStorage.setItem("inversion-rpg-admin-activeTab", activeTab);
    });
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
        <BlogPostAdd />
        <RulesSummaryAddEdit />
    </Tabs.Root>
</NormalPage>
