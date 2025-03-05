<script>
    import { modes } from "$lib/store.svelte.js";
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
        <li>
            <a href="/settings">Account & Settings</a>
        </li>
        <li>
            <a href="/login">Login/Register</a>
        </li>
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
