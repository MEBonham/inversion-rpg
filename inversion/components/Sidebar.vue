
<template>
    <aside>
        <MePortrait />
        <h1>McKay Bonham</h1>
    </aside>
</template>

<style scoped>
aside {
    width: 36%;
    height: 100%;
    z-index: 10;
    background-image: url("~/assets/bgs/woodTexture.png");
    box-shadow: 0 0 0.5rem saddlebrown;
    display: flex;
    flex-direction: column;
    align-items: center;

    & h1 {
        font-size: 3.4rem;
    }
}
</style>
