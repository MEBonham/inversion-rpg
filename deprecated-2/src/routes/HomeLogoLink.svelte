<script>
    import { modes } from "$lib/store.svelte.js";
</script>

<header>
    <a href="/" class={modes.isOnMobile ? "" : "big"}>
        <img src="/Title Logo.png" alt="Inversion RPG Logo" />
    </a>
</header>

<style>
    header {
        width: 100%;
        background-color: var(--parchment);
        box-shadow: 0 0 2.2rem var(--invertParchment) inset;
        display: flex;
        justify-content: center;

        & a {
            max-width: 16.0rem;
            
            &.big {
                max-width: 24.0rem;
            }
        }
    }
</style>
