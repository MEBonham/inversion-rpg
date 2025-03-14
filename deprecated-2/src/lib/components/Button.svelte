<script>
    let { children, ...rest } = $props();
</script>

<button {...rest}>
    {@render children()}
</button>

<style>
    button {
        padding: 0.4rem 1.0rem;
        border-radius: 0.6rem;
        box-shadow: 0 0 0.2rem var(--invertParchment);
        background-color: var(--headerColor);
        color: var(--parchment);
        transition: background-color 0.2s;

        &:hover {
            background-color: var(--boldTorquoise);
        }
    }
</style>
