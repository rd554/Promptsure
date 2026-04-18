"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from "recharts";
import { TrendingUp, Activity, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TrendChart } from "@/components/results/trend-chart";
import { EmptyState } from "@/components/shared/empty-state";
import { demoAnalytics } from "@/lib/demo-data";
import type { AnalyticsData } from "@/types";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoData, setIsDemoData] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const { data } = await res.json();
        if (data && data.total_simulations > 0) {
          setAnalytics({
            ...data,
            simulations_by_day: data.simulations_by_day?.length
              ? data.simulations_by_day
              : demoAnalytics.simulations_by_day,
            score_distribution: data.score_distribution?.length
              ? data.score_distribution
              : demoAnalytics.score_distribution,
            scores_over_time: data.scores_over_time?.length
              ? data.scores_over_time
              : demoAnalytics.scores_over_time,
          });
        } else {
          setAnalytics(demoAnalytics);
          setIsDemoData(true);
        }
      } else {
        setAnalytics(demoAnalytics);
        setIsDemoData(true);
      }
    } catch {
      setAnalytics(demoAnalytics);
      setIsDemoData(true);
    }
    setLoading(false);
  };

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; payload: Record<string, string | number> }>;
  }) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      const labelKey = "date" in entry ? "date" : "range";
      return (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl">
          <p className="text-sm font-medium">{entry[labelKey]}</p>
          <p className="text-sm text-zinc-400">
            Count: <span className="font-bold text-zinc-100">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const distColor = (range: string) => {
    if (range.startsWith("81")) return "#10b981";
    if (range.startsWith("61")) return "#eab308";
    if (range.startsWith("41")) return "#f97316";
    return "#ef4444";
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold"
          >
            Analytics
          </motion.h1>
          {isDemoData && (
            <Badge variant="warning">Demo data — run simulations to see your own</Badge>
          )}
        </div>
        <p className="text-zinc-400 mt-1">
          Aggregate performance across all your AI features
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      ) : !analytics ? (
        <EmptyState
          icon={BarChart3}
          title="No analytics yet"
          description="Run some simulations to see your performance analytics here."
        />
      ) : (
        <>
          <StatsCards data={analytics} />

          <TrendChart data={analytics.scores_over_time} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card glass>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-violet-400" />
                  Simulations by Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart
                    data={analytics.simulations_by_day}
                    margin={{ top: 5, right: 5, bottom: 5, left: -10 }}
                  >
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      axisLine={{ stroke: "#27272a" }}
                    />
                    <YAxis
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      axisLine={{ stroke: "#27272a" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="url(#areaGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card glass>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={analytics.score_distribution}
                    margin={{ top: 5, right: 5, bottom: 5, left: -10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis
                      dataKey="range"
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      axisLine={{ stroke: "#27272a" }}
                    />
                    <YAxis
                      tick={{ fill: "#71717a", fontSize: 12 }}
                      axisLine={{ stroke: "#27272a" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {analytics.score_distribution.map((entry, i) => (
                        <Cell key={i} fill={distColor(entry.range)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
