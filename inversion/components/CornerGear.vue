<script setup>
const { classes } = defineProps(["classes"]);
</script>

<template>
    <img src="~/assets/Gear Full.png" alt="rivet" :class="classes" />
</template>

<style scoped>
img {
    position: absolute;
    width: 4.0rem;

    &.top.left {
        top: 0;
        left: 0;
        transform: translateY(-35%) translateX(-35%);
    }
    &.top.right {
        top: 0;
        right: 0;
        transform: translateY(-35%) translateX(35%);
    }
    &.bottom.left {
        bottom: 0;
        left: 0;
        transform: translateY(35%) translateX(-35%);
    }
    &.bottom.right {
        bottom: 0;
        right: 0;
        transform: translateY(35%) translateX(35%);
    }
}
</style>
