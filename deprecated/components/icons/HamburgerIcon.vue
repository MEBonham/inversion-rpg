<script setup>
const { dimension } = defineProps(["dimension"]);
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 14 14"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="6.5"/><path d="M4.5 4.5h5M4.5 7h5m-5 2.5h5"/></g></svg>
</template>

<style scoped>
svg {
    width: v-bind(dimension);
    height: v-bind(dimension);
}
</style>