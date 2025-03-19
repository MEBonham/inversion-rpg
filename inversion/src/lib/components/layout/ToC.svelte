<script>
    import { modes } from "$lib/store.svelte.js";

    let { closeFct = () => {} } = $props();
</script>

<nav>
    <a href="/campaigns" onclick={closeFct}>Campaigns</a>
    <a href="/characters" onclick={closeFct}>Characters</a>
    <a href="/settings" onclick={closeFct}>Account & Settings</a>
    <a href="/login" onclick={closeFct}>Login/Register</a>
</nav>

<style>
    nav {
        height: 100%;
        padding: 1.4rem 3.4rem;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        color: var(--consistentLight);
        font-size: 2.0rem;
    }
</style>
