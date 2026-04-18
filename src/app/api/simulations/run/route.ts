import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { runPromptSimulation, evaluateOutput } from "@/lib/openai";

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
    const { project_id, scenario_ids } = body;

    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", project_id)
      .single();

    if (!project?.prompt_template) {
      return NextResponse.json(
        { error: "Project has no prompt template" },
        { status: 400 }
      );
    }

    const { data: scenarios } = await supabase
      .from("scenarios")
      .select("*")
      .in("id", scenario_ids);

    if (!scenarios || scenarios.length === 0) {
      return NextResponse.json(
        { error: "No scenarios found" },
        { status: 400 }
      );
    }

    const { data: job, error: jobErr } = await supabase
      .from("jobs")
      .insert({
        project_id,
        type: "run_simulation",
        status: "running",
        payload: { scenario_ids },
        progress: 0,
        total: scenarios.length,
      })
      .select()
      .single();

    if (jobErr) throw jobErr;

    processSimulations(supabase, project, scenarios, job.id).catch(console.error);

    return NextResponse.json({ data: job });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to start simulation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function processSimulations(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  project: { id: string; prompt_template: string },
  scenarios: Array<{ id: string; input_text: string }>,
  jobId: string
) {
  let completed = 0;

  for (const scenario of scenarios) {
    try {
      const { data: sim } = await supabase
        .from("simulations")
        .insert({
          project_id: project.id,
          scenario_id: scenario.id,
          input: scenario.input_text,
          status: "running",
        })
        .select()
        .single();

      if (!sim) continue;

      const result = await runPromptSimulation(
        project.prompt_template,
        scenario.input_text
      );

      await supabase
        .from("simulations")
        .update({
          output: result.output,
          latency: result.latency,
          tokens: result.tokens,
          status: "completed",
        })
        .eq("id", sim.id);

      const evaluation = await evaluateOutput(
        scenario.input_text,
        result.output
      );

      await supabase.from("evaluations").insert({
        simulation_id: sim.id,
        ...evaluation,
      });

      completed++;
      await supabase
        .from("jobs")
        .update({ progress: completed })
        .eq("id", jobId);
    } catch (err) {
      console.error(`Simulation failed for scenario ${scenario.id}:`, err);
      completed++;
      await supabase
        .from("jobs")
        .update({ progress: completed })
        .eq("id", jobId);
    }
  }

  await supabase
    .from("jobs")
    .update({ status: "completed" })
    .eq("id", jobId);

  const { data: evalScores } = await supabase
    .from("evaluations")
    .select("overall_score, simulations!inner(project_id)")
    .eq("simulations.project_id", project.id);

  if (evalScores && evalScores.length > 0) {
    const avgScore = Math.round(
      evalScores.reduce((acc, e) => acc + e.overall_score, 0) /
        evalScores.length
    );
    await supabase
      .from("projects")
      .update({ overall_score: avgScore, last_run_at: new Date().toISOString() })
      .eq("id", project.id);
  }
}
