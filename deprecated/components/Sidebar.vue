<script setup>
import HomeLogoLink from './HomeLogoLink.vue';
import ToC from './ToC.vue';
</script>

<template>
    <aside>
        <CornerGear classes="top left" />
        <CornerGear classes="top right" />
        <CornerGear classes="bottom left" />
        <CornerGear classes="bottom right" />
        <HomeLogoLink :isBig="true" />
        <nav>
            <ToC />
        </nav>
    </aside>
</template>

<style scoped>
aside {
    position: relative;
    min-width: 30%;
    height: 100%;
    z-index: 10;
    background-color: var(--invertParchment);
    background-image: url("~/assets/bgs/clockwork.png");
    background-position: center;
    color: var(--parchment);
    box-shadow: 0 0 0.5rem var(--invertParchment);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;

    & h1 {
        font-size: 3.4rem;
    }
    & nav {
        margin-top: 1.4rem;
        width: 100%;
        flex-grow: 1;
        padding: 0 3.4rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.4rem;
    }
}
</style>
