<script>
    import { modes } from "$lib/store.svelte.js";

    let { children, title } = $props();
</script>

<main id="page" class={modes.isOnMobile ? "mobileMode" : ""}>
    <header>
        <h1>{title}</h1>
    </header>
    {@render children()}
    <img src="/bgs/Left%20Frills.png" alt="frill" class="left" />
    <img src="/bgs/Right%20Frills.png" alt="frill" class="right" />
    <img src="/bgs/Background%20Gear%20Left.png" alt="rivet" class="cornerLeft" />
    <img src="/bgs/Background%20Gear%20Right.png" alt="rivet" class="cornerRight" />
</main>

<style>
    main#page {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 1.4rem;
        background-color: var(--parchment);
        background-image: url("/bgs/parchment.png");
        background-size: cover;
        padding: 0.6rem 6.0rem 0.4rem;

        & header {
            width: 100%;
            display: flex;
            justify-content: center;

            & h1 {
                margin-top: 1.6rem;
                font-size: 4.0rem;
            }
        }
        & :global(h2) {
            font-size: 2.8rem;
            font-family: "Postamt", sans-serif;
            color: var(--boldTorquoise);
        }
    }

    img.left {
        position: absolute;
        top: 5.0rem;
        left: 0.6rem;
        height: calc(100% - 4.8rem);
    }
    img.right {
        position: absolute;
        top: 5.0rem;
        right: 0.6rem;
        height: calc(100% - 4.8rem);
    }
    img.cornerLeft {
        position: absolute;
        top: 0.4rem;
        left: 0.4rem;
        height: 6.0rem;
    }
    img.cornerRight {
        position: absolute;
        top: 0.4rem;
        right: 0.4rem;
        height: 6.0rem;
    }
</style>
