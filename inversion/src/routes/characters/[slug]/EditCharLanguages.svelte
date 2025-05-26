<script>
	import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { DropdownMenu } from "bits-ui";
    import { handleSubmit, sleep } from "$lib/utils";
	import BufferDot from "$lib/components/BufferDot.svelte";
    import Button from "$lib/components/Button.svelte";
    import NormalForm from "$lib/components/NormalForm.svelte";
    import TrashIcon from "$lib/components/icons/TrashIcon.svelte";

    let { action, closeDialog } = $props();
    let allLanguages = $state([]);
    let languages = $state(
        $page.data.character.character_languages.map((obj) => obj.languages)
    );
    let selectNewLanguageOpen = $state(false);
    onMount(async () => {
        const jsonRes = await fetch("/api/v1/fetchChoices/languages");
        if (jsonRes.ok) {
            allLanguages = await jsonRes.json();
        }
        loading = false;
    });

    let loading = $state(true);
    const cleanupSubmit = async () => {
        await sleep(0.1);
        closeDialog();
    }
</script>

<NormalForm method="post" {action} fct={() => handleSubmit(loading, cleanupSubmit)}>
    <input type="hidden" name="character_id" id="character_id" value={$page.data.character.id} />
    <input type="hidden" name="languages" id="languages" value={JSON.stringify(languages)} />
    <ul>
        {#each languages as language, index}
            <li>
                <button class="warning" type="button" onclick={() => languages.splice(index, 1)}>
                    <TrashIcon size="1.6rem" />
                </button>
                <BufferDot />
                <span>{language.language_name}</span>
            </li>
        {/each}
        <li>
            <span class="needsBufferSpace">Add language:</span>
            <DropdownMenu.Root bind:open={selectNewLanguageOpen}>
                <DropdownMenu.Trigger>
                    {#snippet child({ props })}
                        <Button {...props}>
                            (None)
                        </Button>
                    {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    {#each allLanguages.filter((language) => !languages.find((existinglanguage) => existinglanguage.id === language.id)) as language}
                        <DropdownMenu.Item>
                            {#snippet child({ props })}
                                <div { ...props } onclick={() => {
                                    languages.push(language);
                                    selectNewLanguageOpen = false;
                                }}>
                                    {language.language_name}
                                </div>
                            {/snippet}
                        </DropdownMenu.Item>
                    {/each}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </li>
    </ul>
    <footer>
        <Button type="submit" disabled={loading}>
            {loading ? "Loading ..." : "Save"}
        </Button>
    </footer>
</NormalForm>

<style>
    span.needsBufferSpace {
        margin-right: 3.0rem;
    }
</style>
