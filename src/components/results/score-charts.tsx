"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SimulationWithEval } from "@/types";

interface ScoreChartsProps {
  simulations: SimulationWithEval[];
}

export function ScoreCharts({ simulations }: ScoreChartsProps) {
  const evaluated = simulations.filter((s) => s.evaluation);

  const scoreData = [
    {
      name: "Helpfulness",
      score: avg(evaluated.map((s) => s.evaluation!.helpfulness_score)),
    },
    {
      name: "Tone",
      score: avg(evaluated.map((s) => s.evaluation!.tone_score)),
    },
    {
      name: "Accuracy",
      score: avg(evaluated.map((s) => s.evaluation!.accuracy_score)),
    },
    {
      name: "Safety",
      score: avg(evaluated.map((s) => s.evaluation!.safety_score)),
    },
    {
      name: "Hallucination",
      score: avg(evaluated.map((s) => s.evaluation!.hallucination_score)),
    },
  ];

  const getBarColor = (score: number) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#eab308";
    if (score >= 40) return "#f97316";
    return "#ef4444";
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { name: string } }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl">
          <p className="text-sm font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-zinc-400">
            Score: <span className="font-bold text-zinc-100">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card glass>
      <CardHeader>
        <CardTitle>Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoreData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={{ stroke: "#27272a" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={{ stroke: "#27272a" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {scoreData.map((entry, i) => (
                <Cell key={i} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}
