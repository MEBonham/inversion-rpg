<template>
    <button>
        <slot />
    </button>
</template>

<style scoped>
button {
    background-color: var(--parchment);
    border-radius: 0.6rem;
    border: 2px solid var(--boldTorquoise);
    padding: 0.2rem 0.8rem;
}
</style>
