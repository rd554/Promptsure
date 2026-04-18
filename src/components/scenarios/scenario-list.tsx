"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, User, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ScenarioGenerator } from "./scenario-generator";
import type { Scenario } from "@/types";

interface ScenarioListProps {
  scenarios: Scenario[];
  projectId: string;
  projectDescription: string;
  onGenerated: (scenarios: Scenario[]) => void;
}

const typeColors: Record<string, "success" | "warning" | "danger" | "info" | "purple" | "default"> = {
  happy_path: "success",
  angry: "danger",
  vague: "warning",
  edge_case: "purple",
  adversarial: "danger",
  fraud_attempt: "danger",
  technical: "info",
  emotional: "warning",
  sarcastic: "warning",
  multilingual: "info",
  off_topic: "default",
  formal: "default",
  confused: "warning",
};

export function ScenarioList({
  scenarios,
  projectId,
  projectDescription,
  onGenerated,
}: ScenarioListProps) {
  const [search, setSearch] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);

  const filtered = scenarios.filter(
    (s) =>
      s.input_text.toLowerCase().includes(search.toLowerCase()) ||
      s.type.toLowerCase().includes(search.toLowerCase())
  );

  if (scenarios.length === 0) {
    return (
      <div>
        <EmptyState
          icon={Sparkles}
          title="No scenarios yet"
          description="Generate realistic test scenarios using AI to stress-test your prompts."
          actionLabel="Generate Scenarios"
          onAction={() => setShowGenerator(true)}
        />
        {showGenerator && (
          <Card glass className="mt-6 max-w-lg mx-auto">
            <CardContent className="p-6">
              <ScenarioGenerator
                projectId={projectId}
                projectDescription={projectDescription}
                onGenerated={onGenerated}
              />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search scenarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Badge variant="default">{scenarios.length} scenarios</Badge>
        <Button variant="outline" size="sm" onClick={() => setShowGenerator(!showGenerator)}>
          <Sparkles className="h-3 w-3 mr-1" />
          Generate more
        </Button>
      </div>

      <AnimatePresence>
        {showGenerator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card glass className="mb-4">
              <CardContent className="p-6">
                <ScenarioGenerator
                  projectId={projectId}
                  projectDescription={projectDescription}
                  onGenerated={onGenerated}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {filtered.map((scenario, i) => (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
          >
            <Card glass className="hover:border-zinc-700 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 leading-relaxed">
                      {scenario.input_text}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={typeColors[scenario.type] || "default"}>
                        <Tag className="h-2.5 w-2.5 mr-1" />
                        {scenario.type.replace(/_/g, " ")}
                      </Badge>
                      {scenario.persona && (
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {scenario.persona}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
