<script>
	import BufferDot from "$lib/components/BufferDot.svelte";
    import DiscordIcon from "$lib/components/icons/DiscordIcon.svelte";
</script>

<footer>
    <a class="icon" href="https://discord.gg/GGruKDNBun" target="_blank" rel="noopener noreferrer">
        <DiscordIcon size="2.0rem" />
    </a>
    <BufferDot />
    <a href="https://gabyno.itch.io/inversion-rpg" target="_blank" rel="noopener noreferrer">Get Inversion RPG</a>
</footer>

<style>
    footer {
        z-index: 5;
        width: 100%;
        padding: 0.4rem 1.0rem;
        background-color: var(--lightTorquoise);
        box-shadow: 0 0 0.4rem var(--lightTorquoise);
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--invertParchment);

        & a.icon {
            height: 2.0rem;
        }
    }
</style>
