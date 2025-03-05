<script>
    import { enhance } from "$app/forms";

    let { children, fct, ...rest } = $props();
</script>

<form {...rest} use:enhance={fct}>
    {@render children()}
</form>

<style>
    form {
        max-width: 100%;
        padding: 0.6rem 1.2rem;
        border-radius: 0.8rem;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;

        & :global(label) {
            margin: 0.6rem 0;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            & :global(> span) {
                margin-right: 2.4rem;
            }
            & :global(input) {
                flex-grow: 1;
                flex-shrink: 1;
                padding: 0.4rem;
                border-radius: 0.6rem;
                border: 1px solid hsl(0, 0%, 50%);
                background-color: ivory;
            }
        }
        & :global(label.radio) {
            flex-direction: column;
            align-items: flex-start;
        }
        & :global(div.checkboxRow) {
            display: flex;
            gap: 1.2rem;
            align-items: center;

            & :global(button div[data-checkbox-indicator]) {
                position: relative;
                top: -0.2rem;
                width: 1.6rem;
                height: 1.6rem;
                border-radius: 0.2rem;
                border: 2px solid var(--invertParchment);
                display: flex;
                justify-content: center;
                align-items: center;

                & :global(svg) {
                    position: absolute;
                    top: -0.4rem;
                    left: -0.4rem;
                }
            }
        }
        & :global(footer) {
            width: 100%;
            display: flex;
            justify-content: flex-end;
        }
    }
</style>
