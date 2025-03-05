<script>
    import HomeLogoLink from "./HomeLogoLink.svelte";
    import ToC from "./ToC.svelte";
</script>

<aside id="appSidebar">
    <HomeLogoLink />
    <ToC />
</aside>

<style>
    aside {
        position: relative;
        min-width: 30%;
        height: 100%;
        z-index: 10;
        box-shadow: 0 0 0.5rem var(--invertParchment);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
