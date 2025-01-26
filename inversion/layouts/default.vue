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
    </ScrollAreaRoot>
</template>

<style scoped>
main {
    flex-grow: 1;
    overflow-y: auto;

    &.vStretch {
        height: 100%;
    }
    &.hide {
        display: none;
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
                padding: 0.8rem 3.6rem 1.6rem;
                display: flex;
                flex-direction: column;

                & header {
                    width: 100%;
                    padding: 1.0rem 0;
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
