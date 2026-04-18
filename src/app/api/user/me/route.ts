import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    return NextResponse.json({
      data: {
        id: user.id,
        email: user.email,
        ...(profile || {}),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const allowed: Record<string, unknown> = {};
    for (const key of ["full_name", "building", "use_case", "main_risk"]) {
      if (key in body) allowed[key] = body[key];
    }

    await supabase
      .from("users")
      .upsert({ id: user.id, email: user.email!, ...allowed }, { onConflict: "id" });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
