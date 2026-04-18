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

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET /api/projects] Supabase error:", error.message, error.code);
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json(
          { error: "Database tables not set up. Please run supabase-schema.sql in your Supabase SQL Editor." },
          { status: 503 }
        );
      }
      throw error;
    }

    return NextResponse.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch projects";
    console.error("[GET /api/projects] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user row exists (handles users who signed up before the trigger was created)
    await supabase
      .from("users")
      .upsert(
        { id: user.id, email: user.email! },
        { onConflict: "id" }
      );

    const body = await request.json();
    const { name, description, input_mode, prompt_template, api_endpoint } = body;

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        name,
        description,
        input_mode: input_mode || "prompt",
        prompt_template,
        api_endpoint,
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/projects] Supabase error:", error.message, error.code, error.details);
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json(
          { error: "Database tables not set up. Please run supabase-schema.sql in your Supabase SQL Editor." },
          { status: 503 }
        );
      }
      throw error;
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create project";
    console.error("[POST /api/projects] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
