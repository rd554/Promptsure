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

    const { data: simulations } = await supabase
      .from("simulations")
      .select("latency, tokens, status, created_at")
      .eq("status", "completed");

    const { data: evaluations } = await supabase
      .from("evaluations")
      .select("overall_score, created_at");

    const sims = simulations || [];
    const evals = evaluations || [];

    const totalSimulations = sims.length;
    const avgLatency =
      sims.length > 0
        ? Math.round(
            sims.reduce((acc, s) => acc + (s.latency || 0), 0) / sims.length
          )
        : 0;
    const totalTokens = sims.reduce((acc, s) => acc + (s.tokens || 0), 0);
    const estimatedCost = totalTokens * 0.000002;
    const avgScore =
      evals.length > 0
        ? Math.round(
            evals.reduce((acc, e) => acc + e.overall_score, 0) / evals.length
          )
        : 0;

    return NextResponse.json({
      data: {
        total_simulations: totalSimulations,
        avg_latency: avgLatency,
        total_tokens: totalTokens,
        estimated_cost: estimatedCost,
        avg_score: avgScore,
        simulations_by_day: [],
        score_distribution: [],
        scores_over_time: [],
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch analytics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
