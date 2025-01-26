<script setup>
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from "radix-vue";

defineProps(["hidePage", "vStretch"]);
</script>

<template>
    <ScrollAreaRoot as="main" :class="{ 'hide': hidePage, 'vStretch': vStretch }" type="auto">
        <ScrollAreaViewport>
            <slot />
            <footer class="pageFooter">
                <NuxtLink to="https://gabyno.itch.io/inversion-rpg" target="_blank">Get InversioN RPG</NuxtLink>
            </footer>
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation="vertical">
            <ScrollAreaThumb />
        </ScrollAreaScrollbar>
        <img src="~/assets/Left Frills.png" alt="frill" class="left" />
        <img src="~/assets/Right Frills.png" alt="frill" class="right" />
        <img src="~/assets/Background Gear Left.png" alt="rivet" class="cornerLeft" />
        <img src="~/assets/Background Gear Right.png" alt="rivet" class="cornerRight" />
    </ScrollAreaRoot>
</template>

<style scoped>
main {
    flex-grow: 1;
    overflow-y: auto;
    transition: height 0.3s ease;

    &.vStretch {
        height: 100%;
    }
    &.hide {
        height: 0;

        & > :deep(div[data-radix-scroll-area-viewport]) {
            display: none;
        }
    }

    & > img.left {
        position: absolute;
        top: 5.0rem;
        left: 0.6rem;
        height: calc(100% - 5.0rem);
    }
    & > img.right {
        position: absolute;
        top: 5.0rem;
        right: 0.6rem;
        height: calc(100% - 5.0rem);
    }
    & > img.cornerLeft {
        position: absolute;
        top: 0.4rem;
        left: 0.4rem;
        height: 6.0rem;
    }
    & > img.cornerRight {
        position: absolute;
        top: 0.4rem;
        right: 0.4rem;
        height: 6.0rem;
    }
    & > :deep(div[data-radix-scroll-area-viewport]) {
        width: 100%;
        height: 100%;

        & > div {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;

            & main#page {
                flex-grow: 1;
                background-image: url("~/assets/bgs/parchment.png");
                background-size: cover;
                background-position: center;
                padding: 0.8rem 6.4rem 1.6rem;
                display: flex;
                flex-direction: column;

                & header {
                    width: 100%;
                    padding: 2.2rem 0 1.0rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                
                    & h1 {
                        font-size: 3.8rem;
                    }
                }
            }
            & footer.pageFooter {
                z-index: 5;
                width: 100%;
                padding: 0.4rem 0;
                background-color: var(--lightTorquoise);
                box-shadow: 0 0 0.4rem var(--lightTorquoise);
                display: flex;
                justify-content: center;
            }
        }
    }
}
</style>
