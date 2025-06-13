<script>
    import { page } from "$app/stores";
    import { Slider } from "bits-ui";
    import { handleSubmit, sleep } from "$lib/utils";
    import NormalForm from "$lib/components/NormalForm.svelte";
    import Button from "$lib/components/Button.svelte";

    let { action, skill, closeDialog } = $props();

    let skillRank = $state(skill.rank);

    let loading = $state(false);
    const cleanupSubmit = async () => {
        await sleep(0.1);
        closeDialog();
    }
</script>

<NormalForm method="post" {action} fct={() => handleSubmit(loading, cleanupSubmit)}>
    <input type="hidden" name="character_id" id="character_id" value={$page.data.character.id} />
    <input type="hidden" name="skillName" id="skillName" value={skill.skillName} />
    <input type="hidden" name="newRank" id="newRank" value={skillRank} />
    <header>
        <h2>0</h2>
        <h2>1</h2>
        <h2>2</h2>
        <h2>3</h2>
        <h2>4</h2>
        <h2>5</h2>
    </header>
    <Slider.Root type="single" bind:value={skillRank} min={0} max={5}>
        {#snippet children()}
            <span class="bar">
                <Slider.Range />
            </span>
            <Slider.Thumb index={0} />
        {/snippet}
    </Slider.Root>
    <footer>
        <Button type="submit" disabled={loading}>
            {loading ? "Loading ..." : "Save"}
        </Button>
    </footer>
</NormalForm>

<style>
    header {
        width: 100%;
        display: flex;
        gap: 2.4rem;
    }
</style>
