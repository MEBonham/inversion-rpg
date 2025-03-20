<script>
    import { Toggle } from "bits-ui";
    import Button from "$lib/components/Button.svelte";
    import NormalPage from "$lib/components/NormalPage.svelte";
    import SunIcon from "$lib/components/icons/SunIcon.svelte";
    import MoonDarkIcon from "$lib/components/icons/MoonDarkIcon.svelte";

    let { data } = $props();
    let session = $derived(data.session);
    let nomiker = $derived(session?.user?.user_metadata?.username || session?.user?.user_metadata?.email || "guest");

    let darkMode = $state(
        typeof document !== "undefined" &&
        window.localStorage.getItem("inversion-dark-mode") === "true"
    );
    const handleDarkToggle = () => {
        document.querySelector(":root").classList.toggle("darkMode", darkMode);
        window.localStorage.setItem("inversion-dark-mode", darkMode ? "true" : "false");
    }
</script>

<NormalPage title={`Welcome, ${nomiker}!`} >
    {#if session}
        <section>
            <form method="post" action="?/logout">
                <Button type="submit">Logout</Button>
            </form>
        </section>
    {/if}
    <section>
        <h2 id="darkModeHeader">
            Dark Mode:
            <Toggle.Root bind:pressed={darkMode} onPressedChange={handleDarkToggle}>
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
    section {
        margin: 1.4rem 0;
    }
    
    h2#darkModeHeader {
        display: flex;
        align-items: center;

        & button {
            position: relative;
            top: -0.4rem;
            width: 2.4rem;
            height: 2.4rem;
            margin-left: 0.8rem;
        }
    }
</style>
