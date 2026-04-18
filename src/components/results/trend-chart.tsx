"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrendChartProps {
  data: { date: string; score: number }[];
}

export function TrendChart({ data }: TrendChartProps) {
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { date: string } }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl">
          <p className="text-sm font-medium">{payload[0].payload.date}</p>
          <p className="text-sm text-zinc-400">
            Score: <span className="font-bold text-violet-400">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card glass>
      <CardHeader>
        <CardTitle>Score Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={{ stroke: "#27272a" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={{ stroke: "#27272a" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", r: 4 }}
              activeDot={{ r: 6, fill: "#a78bfa" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
