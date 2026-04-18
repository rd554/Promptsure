import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateScenarios } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { project_id, feature_description, goal, count } = body;

    console.log("[scenarios/generate] Calling OpenAI for", count || 30, "scenarios...");

    let scenarios;
    try {
      scenarios = await generateScenarios(
        feature_description,
        goal,
        count || 30
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[scenarios/generate] OpenAI error:", msg);
      return NextResponse.json({ error: `OpenAI error: ${msg}` }, { status: 502 });
    }

    console.log("[scenarios/generate] OpenAI returned", scenarios?.length, "scenarios");

    if (!Array.isArray(scenarios) || scenarios.length === 0) {
      console.error("[scenarios/generate] Invalid response format:", typeof scenarios, scenarios);
      return NextResponse.json(
        { error: "OpenAI returned an invalid response. Try again." },
        { status: 502 }
      );
    }

    const scenarioRows = scenarios.map((s) => {
      const text =
        (typeof s.input_text === "string" && s.input_text) ||
        (typeof s.input === "string" && s.input) ||
        (typeof s.text === "string" && s.text) ||
        (typeof s === "string" ? s : JSON.stringify(s));
      return {
        project_id,
        input_text: text,
        type: s.type || "general",
        persona: s.persona || null,
      };
    });

    const { data, error } = await supabase
      .from("scenarios")
      .insert(scenarioRows)
      .select();

    if (error) {
      console.error("[scenarios/generate] Supabase insert error:", error.message, error.code);
      throw error;
    }

    console.log("[scenarios/generate] Inserted", data?.length, "scenarios into DB");
    return NextResponse.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate scenarios";
    console.error("[scenarios/generate] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
