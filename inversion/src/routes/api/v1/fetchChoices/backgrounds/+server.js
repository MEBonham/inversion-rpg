import { json } from "@sveltejs/kit";

export const GET = async ({ locals: { supabase } }) => {
    const { data, error } = await supabase.from("backgrounds").select("*");
	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return json(data);
};
