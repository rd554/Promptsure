import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: project, error: projErr } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (projErr) throw projErr;

    const { data: scenarios } = await supabase
      .from("scenarios")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: false });

    const { data: simulations } = await supabase
      .from("simulations")
      .select("*, evaluations(*), scenarios(*)")
      .eq("project_id", id)
      .order("created_at", { ascending: false });

    const formattedSimulations = simulations?.map((sim) => ({
      ...sim,
      evaluation: sim.evaluations?.[0] || null,
      scenario: sim.scenarios || null,
    }));

    return NextResponse.json({
      data: {
        project,
        scenarios: scenarios || [],
        simulations: formattedSimulations || [],
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
