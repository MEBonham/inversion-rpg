<script setup>
import NormalButton from '~/components/common/NormalButton.vue';

const supabase = useSupabaseClient()
const email = ref('')

const signInWithOtp = async () => {
    const { error } = await supabase.auth.signInWithOtp({
        email: email.value,
        options: {
            emailRedirectTo: `${process.env.LOCAL_URL}/confirm`,
        },
    });
    if (error) console.error(error);
}
</script>

<template>
    <main id="page">
        <header>
            <h1>Login/Register</h1>
        </header>
        <form>
            <input v-model="email" type="email" placeholder="example@mydomain.com" />
            <NormalButton @click="signInWithOtp">Send Magic Link</NormalButton>
        </form>
    </main>
</template>

<style scoped>
form {
    max-width: 32.0rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;

    & input {
        background-color: var(--parchment);
        border: 1px solid var(--headerColor);
        padding: 0 0.6rem;
    }
}
</style>
