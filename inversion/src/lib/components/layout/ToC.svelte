<script>
    import { modes } from "$lib/store.svelte.js";

    let { closeFct = () => {} } = $props();
</script>

<ul>
    <li>
        <a href="/campaigns" onclick={closeFct}>Campaigns</a>
    </li>
    <li>
        <a href="/characters" onclick={closeFct}>Characters</a>
    </li>
    <li>
        <a href="/settings" onclick={closeFct}>Account & Settings</a>
    </li>
    <li>
        <a href="/login" onclick={closeFct}>Login/Register</a>
    </li>
</ul>

<style>
    ul {
        height: 100%;
        padding: 1.4rem 3.4rem;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        color: var(--consistentLight);
        font-size: 2.0rem;
    }
</style>
