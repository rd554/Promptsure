"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Scenario } from "@/types";

interface ScenarioGeneratorProps {
  projectId: string;
  projectDescription: string;
  onGenerated: (scenarios: Scenario[]) => void;
}

export function ScenarioGenerator({
  projectId,
  projectDescription,
  onGenerated,
}: ScenarioGeneratorProps) {
  const [goal, setGoal] = useState("");
  const [count, setCount] = useState(30);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setProgress("Connecting to AI...");

    try {
      const res = await fetch("/api/scenarios/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          feature_description: projectDescription,
          goal,
          count,
        }),
      });

      setProgress("Generating scenarios...");

      const json = await res.json();
      if (res.ok) {
        onGenerated(json.data);
        setProgress(`Generated ${json.data.length} scenarios!`);
        setTimeout(() => setProgress(""), 3000);
      } else {
        setProgress(json.error || "Generation failed. Try again.");
      }
    } catch (err) {
      setProgress("Network error. Check connection.");
      console.error("Scenario generation error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Testing goal</Label>
        <Input
          placeholder="e.g., Test how the bot handles angry customers"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Number of scenarios</Label>
        <div className="flex items-center gap-3">
          {[10, 20, 30, 50].map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                count === n
                  ? "border-violet-500 bg-violet-500/10 text-violet-300"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {progress && (
        <p className="text-sm text-zinc-400 flex items-center gap-2">
          {loading && <Loader2 className="h-3 w-3 animate-spin" />}
          {progress}
        </p>
      )}

      <Button
        variant="primary"
        onClick={handleGenerate}
        disabled={loading || !goal}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate {count} Scenarios
          </>
        )}
      </Button>
    </div>
  );
}
