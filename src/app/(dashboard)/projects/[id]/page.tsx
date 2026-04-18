"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Sparkles,
  FileText,
  BarChart3,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ScenarioGenerator } from "@/components/scenarios/scenario-generator";
import { ScenarioList } from "@/components/scenarios/scenario-list";
import { SimulationRunner } from "@/components/simulations/simulation-runner";
import { SimulationLogs } from "@/components/simulations/simulation-logs";
import { ScoreOverview } from "@/components/results/score-overview";
import { ScoreCharts } from "@/components/results/score-charts";
import { InsightsPanel } from "@/components/results/insights-panel";
import { getDemoData } from "@/lib/demo-data";
import type { Project, Scenario, SimulationWithEval, Job } from "@/types";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [simulations, setSimulations] = useState<SimulationWithEval[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const { data } = await res.json();
        setProject(data.project);
        setScenarios(data.scenarios || []);
        setSimulations(data.simulations || []);
      } else {
        loadDemoProject();
      }
    } catch {
      loadDemoProject();
    }
    setLoading(false);
  };

  const loadDemoProject = () => {
    const demo = getDemoData();
    setProject(demo.project);
    setScenarios(demo.scenarios);
    setSimulations(demo.simulations);
  };

  const handleScenariosGenerated = (newScenarios: Scenario[]) => {
    setScenarios((prev) => [...prev, ...newScenarios]);
    setTab("scenarios");
  };

  const handleSimulationStarted = (job: Job) => {
    setActiveJob(job);
    setTab("simulations");
    pollJobStatus(job.id);
  };

  const pollJobStatus = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (res.ok) {
          const { data } = await res.json();
          setActiveJob(data);
          if (data.status === "completed" || data.status === "failed") {
            clearInterval(interval);
            loadProject();
          }
        }
      } catch {
        clearInterval(interval);
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-400">Project not found</p>
        <Button variant="outline" onClick={() => router.push("/dashboard")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const completedSims = simulations.filter((s) => s.status === "completed");
  const avgScore =
    completedSims.length > 0
      ? Math.round(
          completedSims.reduce(
            (acc, s) => acc + (s.evaluation?.overall_score || 0),
            0
          ) / completedSims.length
        )
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold"
          >
            {project.name}
          </motion.h1>
          <p className="text-sm text-zinc-400 mt-0.5">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="purple">{project.input_mode}</Badge>
          {project.overall_score && (
            <Badge
              variant={
                project.overall_score >= 70
                  ? "success"
                  : project.overall_score >= 50
                  ? "warning"
                  : "danger"
              }
            >
              Score: {project.overall_score}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Scenarios", value: scenarios.length, icon: FileText },
          { label: "Simulations", value: simulations.length, icon: Play },
          { label: "Avg Score", value: `${avgScore}/100`, icon: BarChart3 },
          {
            label: "Last Run",
            value: project.last_run_at
              ? new Date(project.last_run_at).toLocaleDateString()
              : "Never",
            icon: Clock,
          },
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

      {activeJob && activeJob.status === "running" && (
        <Card glass className="border-violet-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
              <span className="text-sm font-medium">
                {activeJob.type === "generate_scenarios"
                  ? "Generating scenarios..."
                  : activeJob.type === "run_simulation"
                  ? "Running simulations..."
                  : "Evaluating outputs..."}
              </span>
              <span className="text-xs text-zinc-500 ml-auto">
                {activeJob.progress || 0}/{activeJob.total || 0}
              </span>
            </div>
            <Progress
              value={
                activeJob.total
                  ? ((activeJob.progress || 0) / activeJob.total) * 100
                  : 0
              }
            />
          </CardContent>
        </Card>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scenarios">
            Scenarios
            {scenarios.length > 0 && (
              <Badge variant="default" className="ml-2 text-xs">
                {scenarios.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="simulations">
            Simulations
            {simulations.length > 0 && (
              <Badge variant="default" className="ml-2 text-xs">
                {simulations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card glass>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  Generate Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScenarioGenerator
                  projectId={project.id}
                  projectDescription={project.description}
                  onGenerated={handleScenariosGenerated}
                />
              </CardContent>
            </Card>

            <Card glass>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-blue-400" />
                  Run Simulation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimulationRunner
                  projectId={project.id}
                  scenarios={scenarios}
                  promptTemplate={project.prompt_template}
                  onStarted={handleSimulationStarted}
                />
              </CardContent>
            </Card>
          </div>

          {completedSims.length > 0 && (
            <ScoreOverview simulations={completedSims} />
          )}
        </TabsContent>

        <TabsContent value="scenarios" className="mt-6">
          <ScenarioList
            scenarios={scenarios}
            projectId={project.id}
            projectDescription={project.description}
            onGenerated={handleScenariosGenerated}
          />
        </TabsContent>

        <TabsContent value="simulations" className="mt-6">
          <SimulationLogs simulations={simulations} />
        </TabsContent>

        <TabsContent value="results" className="space-y-6 mt-6">
          {completedSims.length > 0 ? (
            <>
              <ScoreOverview simulations={completedSims} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScoreCharts simulations={completedSims} />
                <InsightsPanel simulations={completedSims} />
              </div>
            </>
          ) : (
            <Card glass>
              <CardContent className="py-16 text-center">
                <p className="text-zinc-400">
                  No completed simulations yet. Run simulations to see results.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
