import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { evaluateOutput } from "@/lib/openai";

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
    const { simulation_id } = body;

    const { data: sim } = await supabase
      .from("simulations")
      .select("*")
      .eq("id", simulation_id)
      .single();

    if (!sim || !sim.output) {
      return NextResponse.json(
        { error: "Simulation not found or has no output" },
        { status: 400 }
      );
    }

    const evaluation = await evaluateOutput(sim.input, sim.output);

    const { data, error } = await supabase
      .from("evaluations")
      .insert({
        simulation_id,
        ...evaluation,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to evaluate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
