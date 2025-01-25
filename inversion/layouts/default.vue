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
    background-image: url("~/assets/bgs/geometric.png"), linear-gradient(to bottom right, skyblue, deepskyblue);

    &.hide {
        display: none;
    }
}
</style>
