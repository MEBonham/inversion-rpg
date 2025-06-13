<script>

</script>

<header>
    <div>
        <h2>+1</h2>
        <h2>+2</h2>
        <h2>+3</h2>
        <div class="advantage"></div>
        <div class="specialty"></div>
    </div>
</header>

<style>
    header {
        width: 100%;
        padding-right: 8.0rem;
        display: flex;
        justify-content: flex-end;

        & > div {
            width: calc(70% - 0.3rem);
            display: flex;
            justify-content: space-between;

            & h2 {
                margin: 0;
                font-size: 1.6rem;
                color: var(--invertParchment);
            }
            & div {
                width: 1.6rem;
                height: 1.6rem;
                background-size: contain;

                &.advantage {
                    background-image: url("/charSheet/Rank 4 Icon.png");
                }
                &.specialty {
                    background-image: url("/charSheet/Rank 5 Icon.png");
                }
            }
        }
    }
</style>
