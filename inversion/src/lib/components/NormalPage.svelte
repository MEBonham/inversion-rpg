<script>
    let { children, title } = $props();
</script>

<main id="page">
    <header>
        <h1>{title}</h1>
    </header>
    {@render children()}
</main>

<style>
    main {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        background-color: var(--parchment);
        background-image: url("/bgs/transParchment.png");
        background-position: center;
        background-size: cover;
        padding: 0.6rem 6.0rem 2.4rem;

        & > header {
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
            margin-top: 1.2rem;
        }
        & :global(h3) {
            font-size: 2.2rem;
            font-family: "Girassol", sans-serif;
            color: var(--headerColor);
            margin-top: 0.8rem;
        }
    }
</style>
