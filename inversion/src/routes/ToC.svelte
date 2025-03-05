<script>
    import { page } from "$app/stores";
    import { modes } from "$lib/store.svelte.js";

    const { data } = $page;
    let profile = $derived(data.profile);
</script>

<nav class={modes.isOnMobile && modes.mobileOverlayOpen ? "open" : ""}>
    <ul>
        <li>
            <a href="/campaigns">Campaigns</a>
        </li>
        <li>
            <a href="/characters">Characters</a>
        </li>
        <li>
            <a href="/play">Play Inversion</a>
        </li>
        {#if profile && profile.privilege > 0}
            <li>
                <a href="/settings">Account & Settings</a>
            </li>
        {:else}
            <li>
                <a href="/login">Login/Register</a>
            </li>
        {/if}
    </ul>
</nav>

<style>
    nav {
        width: 100%;
        flex-grow: 1;
        padding: 1.4rem 3.4rem;
        background-color: var(--invertParchment);
        background-image: url("/bgs/transParchment.png");
        background-position: center;
        display: flex;
        justify-content: center;
        color: var(--parchment);
        font-size: 2.0rem;

        &.open {
            width: 100%;
            height: calc(100% - var(--overlayHeaderHeight));
            position: absolute;
            bottom: 0;
        }

        ul {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
        }
    }
</style>
