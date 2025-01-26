<script setup>
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from 'radix-vue';
import HomeLogoLink from './HomeLogoLink.vue';
import ToC from './ToC.vue';
import HamburgerIcon from './icons/HamburgerIcon.vue';

const props = defineProps(["mobileOverlayOpen"]);
const emitToggle = defineEmits(["update:mobileOverlayOpen"]);

const localOpen = computed({
    get: () => props.mobileOverlayOpen,
    set: (value) => emitToggle('update:mobileOverlayOpen', value),
});
</script>

<template>
    <CollapsibleRoot id="mobileOverlay" v-model:open="localOpen">
        <header>
            <CornerGear classes="top left" />
            <CornerGear classes="top right" />
            <CollapsibleTrigger as-child>
                <button @click="localOpen = !localOpen">
                    <HamburgerIcon dimension="3rem" />
                </button>
            </CollapsibleTrigger>
            <HomeLogoLink :isBig="false" />
        </header>
        <CollapsibleContent as="nav">
            <CornerGear classes="bottom left" />
            <CornerGear classes="bottom right" />
            <ToC />
        </CollapsibleContent>
    </CollapsibleRoot>
</template>

<style scoped>
div#mobileOverlay {
    width: 100%;
    z-index: 10;
    background-color: var(--invertParchment);
    background-image: url("~/assets/bgs/clockwork.png");
    box-shadow: 0 0 0.5rem var(--invertParchment);
    color: var(--parchment);
    display: flex;
    flex-direction: column;
    transition: height 0.3s ease;

    &[data-state="open"] {
        height: 100%;
    }

    & > header {
        position: relative;
        width: 100%;
        padding: 1.0rem 0;
        display: flex;
        justify-content: center;
        align-items: center;

        & button {
            position: absolute;
            top: 50%;
            left: 1.6rem;
            transform: translateY(-50%);
        }
        & h1 {
            font-size: 3.0rem;
        }
    }
    & nav {
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
