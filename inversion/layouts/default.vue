<script setup>
defineProps(['hidePage']);
</script>

<template>
    <main :class="{ 'hide': hidePage }">
        <slot />
        <footer>
            <a href="https://gabyno.itch.io/inversion-rpg" target="_blank">Get InversioN RPG</a>
        </footer>
    </main>
</template>

<style scoped>
main {
    flex-grow: 1;
    background-image: url("~/assets/bgs/parchment.png");
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;

    &.hide {
        display: none;
    }

    & > footer {
        z-index: 5;
        width: 100%;
        padding: 0.4rem 0;
        background-color: var(--torquoise);
        box-shadow: 0 0 0.4rem var(--torquoise);
        color: black;
        display: flex;
        justify-content: center;
    }
}
</style>
