// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-01-24",
    css: [
        "~/assets/reset.css",
        "~/assets/main.css",
    ],
    devtools: { enabled: true },
    modules: [
        "@vueuse/nuxt",
        "@nuxtjs/supabase",
    ],
    pages: true,
    supabase: {
        redirectOptions: {
            login: "/login",
            callback: "/confirm",
            exclude: [
                "/",
                "/settings",
                "/characters",
            ],
        },
    },
});
