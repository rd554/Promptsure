"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreRing } from "@/components/shared/score-ring";
import { cn, scoreColor, scoreBgColor } from "@/lib/utils";
import type { SimulationWithEval } from "@/types";

interface ScoreOverviewProps {
  simulations: SimulationWithEval[];
}

export function ScoreOverview({ simulations }: ScoreOverviewProps) {
  const evaluated = simulations.filter((s) => s.evaluation);

  if (evaluated.length === 0) return null;

  const avgScores = {
    helpfulness: avg(evaluated.map((s) => s.evaluation!.helpfulness_score)),
    tone: avg(evaluated.map((s) => s.evaluation!.tone_score)),
    accuracy: avg(evaluated.map((s) => s.evaluation!.accuracy_score)),
    safety: avg(evaluated.map((s) => s.evaluation!.safety_score)),
    hallucination: avg(evaluated.map((s) => s.evaluation!.hallucination_score)),
    overall: avg(evaluated.map((s) => s.evaluation!.overall_score)),
  };

  const metrics = [
    { label: "Helpfulness", value: avgScores.helpfulness },
    { label: "Tone", value: avgScores.tone },
    { label: "Accuracy", value: avgScores.accuracy },
    { label: "Safety", value: avgScores.safety },
    { label: "Hallucination", value: avgScores.hallucination },
  ];

  return (
    <Card glass>
      <CardHeader>
        <CardTitle>Score Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <ScoreRing
              score={avgScores.overall}
              size={120}
              strokeWidth={8}
              label="Overall"
            />
            <p className="text-xs text-zinc-500 mt-2">
              Based on {evaluated.length} evaluations
            </p>
          </motion.div>

          <div className="flex-1 grid grid-cols-5 gap-4">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className={cn(
                  "rounded-xl border p-4 text-center",
                  scoreBgColor(metric.value)
                )}
              >
                <p className="text-xs text-zinc-400 mb-1">{metric.label}</p>
                <p className={cn("text-2xl font-bold", scoreColor(metric.value))}>
                  {metric.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}
