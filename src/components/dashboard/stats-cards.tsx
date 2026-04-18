"use client";

import { motion } from "framer-motion";
import { Activity, Clock, Coins, Zap, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber, formatLatency } from "@/lib/utils";
import type { AnalyticsData } from "@/types";

interface StatsCardsProps {
  data: AnalyticsData;
}

export function StatsCards({ data }: StatsCardsProps) {
  const stats = [
    {
      label: "Total Simulations",
      value: formatNumber(data.total_simulations),
      icon: Activity,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "Avg. Latency",
      value: formatLatency(data.avg_latency),
      icon: Clock,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Token Usage",
      value: formatNumber(data.total_tokens),
      icon: Zap,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Est. Cost",
      value: `$${data.estimated_cost.toFixed(2)}`,
      icon: Coins,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Avg. Score",
      value: `${data.avg_score}/100`,
      icon: TrendingUp,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card glass className="hover:border-zinc-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
