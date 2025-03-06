<script>
    import { modes } from "$lib/store.svelte.js";

    let { children, title } = $props();
</script>

<main id="page" class={modes.isOnMobile ? "mobileMode" : ""}>
    <div id="darkModeBlanket"></div>
    <header>
        <h1>{title}</h1>
    </header>
    <div id="liftPageContent">
        {@render children()}
    </div>
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
        background-color: var(--parchment);
        background-image: url("/bgs/parchment.png");
        background-size: cover;
        padding: 0.6rem 6.0rem 0.4rem;
        overflow-y: hidden;

        & > header {
            z-index: 1;
            width: 100%;
            display: flex;
            justify-content: center;

            & h1 {
                margin-top: 1.6rem;
                font-size: 4.0rem;
            }
        }
        & div#liftPageContent {
            z-index: 1;
            display: flex;
            flex-direction: column;
            gap: 2.0rem;
            margin-bottom: 2.6rem;
        }
        & :global(h2) {
            font-size: 2.8rem;
            font-family: "Postamt", sans-serif;
            color: var(--boldTorquoise);
        }
        & :global(h3) {
            font-size: 2.2rem;
            font-family: "Girassol", sans-serif;
            color: var(--headerColor);
        }
    }

    img.left {
        position: absolute;
        top: 5.0rem;
        left: 0.6rem;
        height: calc(100% - 4.2rem);
        max-width: 3.4rem;
    }
    img.right {
        position: absolute;
        top: 5.0rem;
        right: 0.6rem;
        height: calc(100% - 4.2rem);
        max-width: 3.4rem;
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

    :root #darkModeBlanket {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: none;
    }
    :root.darkMode #darkModeBlanket {
        display: block;
        background-color: hsla(0, 0%, 0%, 0.8);
        z-index: 0;
    }
</style>
