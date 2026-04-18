"use client";

import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, ShieldAlert, ThumbsDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { scoreColor } from "@/lib/utils";
import type { SimulationWithEval } from "@/types";

interface InsightsPanelProps {
  simulations: SimulationWithEval[];
}

export function InsightsPanel({ simulations }: InsightsPanelProps) {
  const evaluated = simulations.filter((s) => s.evaluation);

  const worstScenarios = [...evaluated]
    .sort((a, b) => (a.evaluation?.overall_score || 0) - (b.evaluation?.overall_score || 0))
    .slice(0, 5);

  const failureCategories = getFailureCategories(evaluated);
  const riskLevel = getRiskLevel(evaluated);

  return (
    <Card glass>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Insights & Risks
          <Badge variant={riskLevel === "low" ? "success" : riskLevel === "medium" ? "warning" : "danger"}>
            {riskLevel} risk
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {failureCategories.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Top Failure Categories
            </h4>
            <div className="space-y-2">
              {failureCategories.map((cat, i) => (
                <motion.div
                  key={cat.type}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-zinc-300 capitalize">
                        {cat.type.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs text-zinc-500">{cat.count} failures</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-red-500/60"
                        style={{ width: `${(cat.count / evaluated.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-400" />
            Worst Performing Scenarios
          </h4>
          <div className="space-y-2">
            {worstScenarios.map((sim, i) => (
              <motion.div
                key={sim.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-lg bg-zinc-900/50 p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-300 truncate">{sim.input}</p>
                  <span className="text-xs text-zinc-500">
                    {sim.scenario?.type.replace(/_/g, " ")}
                  </span>
                </div>
                <span className={`text-sm font-bold ${scoreColor(sim.evaluation?.overall_score || 0)}`}>
                  {sim.evaluation?.overall_score}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-zinc-900/50 border border-zinc-800 p-4">
          <h4 className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-violet-400" />
            Recommendations
          </h4>
          <ul className="space-y-1.5 text-sm text-zinc-400">
            {getRecommendations(evaluated).map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <ThumbsDown className="h-3 w-3 mt-1 shrink-0 text-zinc-600" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function getFailureCategories(sims: SimulationWithEval[]) {
  const categories: Record<string, number> = {};
  sims.forEach((sim) => {
    if (sim.evaluation && sim.evaluation.overall_score < 60 && sim.scenario) {
      categories[sim.scenario.type] = (categories[sim.scenario.type] || 0) + 1;
    }
  });
  return Object.entries(categories)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
}

function getRiskLevel(sims: SimulationWithEval[]): "low" | "medium" | "high" {
  const avgScore =
    sims.reduce((acc, s) => acc + (s.evaluation?.overall_score || 0), 0) /
    sims.length;
  if (avgScore >= 75) return "low";
  if (avgScore >= 55) return "medium";
  return "high";
}

function getRecommendations(sims: SimulationWithEval[]): string[] {
  const recs: string[] = [];
  const avgSafety =
    sims.reduce((acc, s) => acc + (s.evaluation?.safety_score || 0), 0) /
    sims.length;
  const avgHalluc =
    sims.reduce((acc, s) => acc + (s.evaluation?.hallucination_score || 0), 0) /
    sims.length;
  const avgTone =
    sims.reduce((acc, s) => acc + (s.evaluation?.tone_score || 0), 0) /
    sims.length;

  if (avgSafety < 80) recs.push("Add stronger safety guardrails to prevent harmful outputs");
  if (avgHalluc < 75) recs.push("Implement RAG or knowledge grounding to reduce hallucinations");
  if (avgTone < 80) recs.push("Refine system prompt for more consistent tone");
  if (recs.length === 0) recs.push("Scores look good! Consider testing with more edge cases.");
  return recs;
}
