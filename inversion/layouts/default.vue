<script setup>
defineProps(['hidePage']);
</script>

<template>
    <main id="page" :class="{ 'hide': hidePage }">
        <slot />
    </main>
</template>

<style scoped>
main#page {
    flex-grow: 1;
    background-image: url("~/assets/bgs/parchment.png");

    &.hide {
        display: none;
    }
}
</style>
