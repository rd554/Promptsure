"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatLatency, getStatusColor, scoreColor } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import type { SimulationWithEval } from "@/types";

interface SimulationLogsProps {
  simulations: SimulationWithEval[];
}

export function SimulationLogs({ simulations }: SimulationLogsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  if (simulations.length === 0) {
    return (
      <EmptyState
        icon={Loader2}
        title="No simulations yet"
        description="Run simulations from the Overview tab to see results here."
      />
    );
  }

  const filtered = simulations.filter((sim) => {
    const matchesSearch =
      sim.input.toLowerCase().includes(search.toLowerCase()) ||
      sim.output?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || sim.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400 shrink-0" />;
      case "running":
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin shrink-0" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-400 shrink-0" />;
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {["all", "completed", "running", "failed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                filter === f
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto overflow-x-hidden">
        {filtered.map((sim, i) => (
          <motion.div
            key={sim.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="w-full"
          >
            <div
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-100 shadow-sm cursor-pointer hover:border-zinc-700 transition-colors"
              onClick={() =>
                setExpandedId(expandedId === sim.id ? null : sim.id)
              }
            >
              {/* Collapsed row */}
              <div className="flex items-center gap-3 p-4">
                {statusIcon(sim.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate">
                    {sim.input}
                  </p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {sim.scenario && (
                      <Badge variant={sim.scenario.type === "happy_path" ? "success" : "default"}>
                        {sim.scenario.type.replace(/_/g, " ")}
                      </Badge>
                    )}
                    {sim.latency && (
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatLatency(sim.latency)}
                      </span>
                    )}
                    {sim.tokens && (
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {sim.tokens} tokens
                      </span>
                    )}
                  </div>
                </div>
                {sim.evaluation && (
                  <span className={`text-lg font-bold shrink-0 ${scoreColor(sim.evaluation.overall_score)}`}>
                    {sim.evaluation.overall_score}
                  </span>
                )}
                <Badge className={`shrink-0 ${getStatusColor(sim.status)}`}>
                  {sim.status}
                </Badge>
                {expandedId === sim.id ? (
                  <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-zinc-500 shrink-0" />
                )}
              </div>

              {/* Expanded detail */}
              <AnimatePresence>
                {expandedId === sim.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="border-t border-zinc-800 p-4 space-y-4"
                      style={{ maxWidth: "100%", boxSizing: "border-box" }}
                    >
                      <div>
                        <p className="text-xs font-medium text-zinc-500 mb-1.5">Input</p>
                        <div className="rounded-lg bg-zinc-950/50 border border-zinc-800/50 p-4 overflow-hidden">
                          <p
                            className="text-sm text-zinc-300 leading-relaxed"
                            style={{ wordBreak: "break-word", overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}
                          >
                            {sim.input}
                          </p>
                        </div>
                      </div>

                      {sim.output && (
                        <div>
                          <p className="text-xs font-medium text-zinc-500 mb-1.5">Output</p>
                          <div className="rounded-lg bg-zinc-950/50 border border-zinc-800/50 p-4 overflow-hidden">
                            <p
                              className="text-sm text-zinc-300 leading-relaxed"
                              style={{ wordBreak: "break-word", overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}
                            >
                              {sim.output}
                            </p>
                          </div>
                        </div>
                      )}

                      {sim.evaluation && (
                        <div>
                          <p className="text-xs font-medium text-zinc-500 mb-2">Evaluation</p>
                          <div className="grid grid-cols-5 gap-2">
                            {[
                              { label: "Help", value: sim.evaluation.helpfulness_score },
                              { label: "Tone", value: sim.evaluation.tone_score },
                              { label: "Accuracy", value: sim.evaluation.accuracy_score },
                              { label: "Safety", value: sim.evaluation.safety_score },
                              { label: "Halluc.", value: sim.evaluation.hallucination_score },
                            ].map((s) => (
                              <div
                                key={s.label}
                                className="text-center rounded-lg bg-zinc-950/50 border border-zinc-800/50 p-2.5"
                              >
                                <p className="text-xs text-zinc-500">{s.label}</p>
                                <p className={`text-sm font-bold ${scoreColor(s.value)}`}>
                                  {s.value}
                                </p>
                              </div>
                            ))}
                          </div>
                          {sim.evaluation.reasoning && (
                            <div className="rounded-lg bg-zinc-950/50 border border-zinc-800/50 p-4 mt-2 overflow-hidden">
                              <p
                                className="text-xs text-zinc-400 italic leading-relaxed"
                                style={{ wordBreak: "break-word", overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}
                              >
                                {sim.evaluation.reasoning}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
