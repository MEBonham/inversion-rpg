<script setup>
const { isBig } = defineProps(["isBig"]);
</script>

<template>
    <NuxtLink to="/" :class="{ big: isBig }">
        <img src="~/assets/Title Logo.png" alt="InversioN RPG Logo" />
    </NuxtLink>
</template>

<style scoped>
a {
    padding: 0 1.0rem 0 1.8rem;
    max-width: 16.0rem;
    border-radius: 50%;
    background-color: var(--parchment);
    box-shadow: 0 0 2.2rem var(--parchment);

    &.big {
        margin: 1.0rem 0;
        max-width: 24.0rem;
    }
}
</style>
