"use client";

import { useState } from "react";
import { Play, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Scenario, Job } from "@/types";

interface SimulationRunnerProps {
  projectId: string;
  scenarios: Scenario[];
  promptTemplate?: string;
  onStarted: (job: Job) => void;
}

export function SimulationRunner({
  projectId,
  scenarios,
  promptTemplate,
  onStarted,
}: SimulationRunnerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [simCount, setSimCount] = useState(10);

  const maxCount = scenarios.length;
  const countOptions = [5, 10, 20, 30, 50].filter((n) => n <= maxCount);
  if (maxCount > 0 && !countOptions.includes(maxCount)) {
    countOptions.push(maxCount);
    countOptions.sort((a, b) => a - b);
  }

  const handleRun = async () => {
    if (scenarios.length === 0) {
      setError("Generate scenarios first before running simulations.");
      return;
    }

    if (!promptTemplate) {
      setError("Set a prompt template in project settings first.");
      return;
    }

    setLoading(true);
    setError("");

    const selectedIds = scenarios.slice(0, simCount).map((s) => s.id);

    try {
      const res = await fetch("/api/simulations/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          scenario_ids: selectedIds,
        }),
      });

      if (res.ok) {
        const { data } = await res.json();
        onStarted(data);
      } else {
        const json = await res.json().catch(() => null);
        setError(json?.error || "Failed to start simulation. Try again.");
      }
    } catch {
      setError("Network error. Check your connection.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Scenarios available</span>
          <Badge variant={scenarios.length > 0 ? "info" : "default"}>
            {scenarios.length} scenarios
          </Badge>
        </div>

        {scenarios.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm text-zinc-400">Simulations to run</span>
            <div className="flex items-center gap-2">
              {countOptions.map((n) => (
                <button
                  key={n}
                  onClick={() => setSimCount(n)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                    simCount === n
                      ? "border-violet-500 bg-violet-500/10 text-violet-300"
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {promptTemplate && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
            <p className="text-xs text-zinc-500 mb-1">Prompt template</p>
            <p className="text-sm text-zinc-300 line-clamp-3 font-mono">
              {promptTemplate}
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2 flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}

      <Button
        variant="primary"
        onClick={handleRun}
        disabled={loading || scenarios.length === 0}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Starting...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Run {Math.min(simCount, maxCount)} Simulation{simCount !== 1 ? "s" : ""}
          </>
        )}
      </Button>

      <p className="text-xs text-zinc-500 text-center">
        Each scenario will be tested against your prompt template.
        Results include latency, tokens, and AI evaluation.
      </p>
    </div>
  );
}
