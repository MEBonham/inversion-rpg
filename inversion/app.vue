<script setup>
import { useMediaQuery } from "@vueuse/core";
import MobileOverlay from './components/MobileOverlay.vue';

useHead({
    title: "InversioN RPG",
});

const { mobileWidthPx } = useAppConfig();
const isMobile = useMediaQuery(`(max-width: ${mobileWidthPx}px)`, { ssrWidth: 768 });
const mobileOverlayOpen = ref(false);
const hidePage = computed(() => isMobile && mobileOverlayOpen);
</script>

<template>
    <div class="envelope" :class="{ mobile: isMobile }">
        <NuxtRouteAnnouncer />
        <MobileOverlay v-if="isMobile" v-model:mobileOverlayOpen="mobileOverlayOpen" />
        <Sidebar v-else />
        <NuxtLayout :hidePage="hidePage.value">
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<style scoped>
div.envelope {
    position: relative;
    width: calc(100dvw - 1.4rem);
    height: calc(100dvh - 1.4rem);
    margin: 0.7rem;
    border-radius: 1.8rem;
    box-shadow: 0 0 1.0rem var(--torquoise);
    overflow: hidden;
    display: flex;
    flex-direction: row;

    &.mobile {
        flex-direction: column;
    }
}
</style>
  