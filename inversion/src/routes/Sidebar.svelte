<script>
	import LogoHomeLink from "$lib/components/layout/LogoHomeLink.svelte";
	import ToC from "$lib/components/layout/ToC.svelte";
</script>

<aside id="appSidebar">
    <LogoHomeLink />
    <div>
        <ToC />
    </div>
</aside>

<style>
    aside {
        position: relative;
        min-width: 23%;
        height: 100%;
        z-index: 10;
        box-shadow: 0 0 0.5rem var(--invertParchment);
        background-color: var(--consistentDark);
        background-image: url("/bgs/transParchment.png");
        background-position: center;
        background-size: cover;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;

        & > div {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
</style>
