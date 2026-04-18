"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  ArrowLeft,
  Play,
  Sparkles,
  BarChart3,
  FileText,
  Clock,
  Zap,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScoreRing } from "@/components/shared/score-ring";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ScenarioList } from "@/components/scenarios/scenario-list";
import { SimulationLogs } from "@/components/simulations/simulation-logs";
import { ScoreOverview } from "@/components/results/score-overview";
import { ScoreCharts } from "@/components/results/score-charts";
import { InsightsPanel } from "@/components/results/insights-panel";
import { TrendChart } from "@/components/results/trend-chart";
import { getDemoData } from "@/lib/demo-data";
import type { DemoProject } from "@/types";

export default function DemoPage() {
  const [data, setData] = useState<DemoProject | null>(null);
  const [tab, setTab] = useState("overview");
  const [simulating, setSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);

  useEffect(() => {
    setData(getDemoData());
  }, []);

  const handleDemoSimulation = () => {
    setSimulating(true);
    setSimProgress(0);

    const interval = setInterval(() => {
      setSimProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setSimulating(false);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 200);
  };

  if (!data) return null;

  const { project, scenarios, simulations, analytics } = data;

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border-b border-violet-500/20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="purple">Demo Mode</Badge>
            <span className="text-sm text-zinc-300">
              Explore the platform with sample data. No login required.
            </span>
          </div>
          <Link href="/auth/signup">
            <Button variant="primary" size="sm">
              Sign up for free
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold">PromptSure</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-sm text-zinc-400">Demo Project</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 mb-3 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to home
            </Link>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-sm text-zinc-400 mt-1">{project.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <ScoreRing score={project.overall_score || 78} size={56} strokeWidth={4} />
            <Badge variant="purple">{project.input_mode}</Badge>
          </div>
        </motion.div>

        {/* Stats */}
        <StatsCards data={analytics} />

        {/* Simulation Demo */}
        <AnimatePresence>
          {simulating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card glass className="border-violet-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
                    <span className="text-sm font-medium">
                      Running {scenarios.length} simulations...
                    </span>
                    <span className="text-xs text-zinc-500 ml-auto">
                      {Math.min(Math.round((simProgress / 100) * scenarios.length), scenarios.length)}/{scenarios.length}
                    </span>
                  </div>
                  <Progress value={Math.min(simProgress, 100)} />
                  <div className="mt-2 space-y-1">
                    {simProgress > 20 && (
                      <p className="text-xs text-zinc-500 animate-fade-in">
                        Testing scenario: &ldquo;Frustrated enterprise customer&rdquo;...
                      </p>
                    )}
                    {simProgress > 50 && (
                      <p className="text-xs text-zinc-500 animate-fade-in">
                        Evaluating output quality and safety scores...
                      </p>
                    )}
                    {simProgress > 80 && (
                      <p className="text-xs text-emerald-400 animate-fade-in">
                        Almost done! Generating insights...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scenarios">
              Scenarios <Badge variant="default" className="ml-1.5 text-xs">{scenarios.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="simulations">
              Simulations <Badge variant="default" className="ml-1.5 text-xs">{simulations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Scenarios", value: scenarios.length, icon: FileText },
                { label: "Simulations", value: simulations.length, icon: Play },
                { label: "Avg Score", value: "78/100", icon: BarChart3 },
                { label: "Last Run", value: "1 hour ago", icon: Clock },
              ].map((stat) => (
                <Card key={stat.label} glass>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="rounded-lg bg-zinc-800 p-2">
                      <stat.icon className="h-4 w-4 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">{stat.label}</p>
                      <p className="font-semibold">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card glass>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-violet-400" />
                    Scenario Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                      <p className="text-xs text-zinc-500 mb-1">Feature description</p>
                      <p className="text-sm text-zinc-300">{project.description}</p>
                    </div>
                    <p className="text-sm text-zinc-400">
                      {scenarios.length} scenarios generated covering {new Set(scenarios.map(s => s.type)).size} types.
                    </p>
                    <Button variant="outline" className="w-full" disabled>
                      <Sparkles className="h-4 w-4" />
                      Generate More (Sign up to use)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card glass>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-blue-400" />
                    Simulation Runner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Scenarios ready</span>
                      <Badge variant="info">{scenarios.length} scenarios</Badge>
                    </div>
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                      <p className="text-xs text-zinc-500 mb-1">Prompt template</p>
                      <p className="text-sm text-zinc-300 font-mono line-clamp-3">
                        {project.prompt_template}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={handleDemoSimulation}
                      disabled={simulating}
                    >
                      {simulating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Run Demo Simulation
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <ScoreOverview simulations={simulations} />
          </TabsContent>

          <TabsContent value="scenarios" className="mt-6">
            <ScenarioList
              scenarios={scenarios}
              projectId={project.id}
              projectDescription={project.description}
              onGenerated={() => {}}
            />
          </TabsContent>

          <TabsContent value="simulations" className="mt-6">
            <SimulationLogs simulations={simulations} />
          </TabsContent>

          <TabsContent value="results" className="space-y-6 mt-6">
            <ScoreOverview simulations={simulations} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScoreCharts simulations={simulations} />
              <InsightsPanel simulations={simulations} />
            </div>
            <TrendChart data={analytics.scores_over_time} />
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <Card glass className="border-violet-500/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to test your own AI?</h2>
            <p className="text-zinc-400 mb-6">
              Create a free account and start testing with real scenarios in minutes.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button variant="primary" size="lg">
                  Sign up free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  <Zap className="h-4 w-4" />
                  View pricing
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
