<script>
    import { Toggle } from "bits-ui";
    import Button from "$lib/components/Button.svelte";
    import NormalPage from "$lib/components/NormalPage.svelte";
    import SunIcon from "$lib/components/icons/SunIcon.svelte";
    import MoonDarkIcon from "$lib/components/icons/MoonDarkIcon.svelte";

    let { data } = $props();
    let session = $derived(data.session);
    let profile = $derived(data.profile);
    let loading = $state(false);

    let darkMode = $state(typeof document !== "undefined" && document?.querySelector(':root')?.classList.contains("darkMode"));
    const handleToggle = () => {
        document.querySelector(':root').classList.toggle("darkMode", darkMode);
        window.localStorage.setItem("inversion-dark-mode", darkMode ? "true" : "false");
    }
</script>

<NormalPage title={`Welcome, ${profile?.username || session?.user?.email || "guest"}!`}>
    {#if session}
        <section>
            <form method="post" action="?/logout">
                <Button type="submit" disabled={loading}>
                    {loading ? "Loading ..." : "Logout"}
                </Button>
            </form>
        </section>
    {/if}
    <section>
        <h2 id="darkModeHeader">
            Dark Mode:
            <Toggle.Root bind:pressed={darkMode} onPressedChange={handleToggle}>
                {#snippet child({ props })}
                    <button {...props}>
                        {#if darkMode}
                            <SunIcon size="2.4rem" />
                        {:else}
                            <MoonDarkIcon size="2.4rem" />
                        {/if}
                    </button>
                {/snippet}
            </Toggle.Root>
        </h2>
    </section>
</NormalPage>

<style>
    h2#darkModeHeader {
        display: flex;
        align-items: center;

        & button {
            position: relative;
            top: -0.4rem;
            width: 2.2rem;
            height: 2.2rem;
            margin-left: 0.8rem;
        }
    }
</style>
    