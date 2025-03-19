import { fail, redirect } from "@sveltejs/kit";
import { PUBLIC_ENV_URL } from "$env/static/public";
import { sleep } from "$lib/utils";

export const load = async ({ locals: { getSession } }) => {
    const session = await getSession();
    if (session) return redirect(303, "/settings");
    return {};
}

export const actions = {
    magicLink: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get("email");

        const validEmail = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,8}$/.test(email);
        if (!validEmail) {
            return fail(400, { isError: true, message: "Invalid email address", src: "magicLink" });
        }

        const { error } = await supabase.auth.signInWithOtp({ email, options: {
            emailRedirectTo: `${PUBLIC_ENV_URL}`
        } });
        if (error) return fail(400, {
            isError: true,
            message: error.message || "Something went wrong.",
            src: "magicLink"
        });

        await sleep(0.1);
        return { isError: false, message: "Check your email!", src: "magicLink" };
    },
}
