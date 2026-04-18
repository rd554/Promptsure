"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard } from "@/components/dashboard/project-card";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { useAppStore } from "@/store";
import { getDemoData, demoAnalytics } from "@/lib/demo-data";
import type { Project, AnalyticsData } from "@/types";

export default function DashboardPage() {
  const { projects, setProjects, addProject } = useAppStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const { data } = await res.json();
        if (data && data.length > 0) {
          setProjects(data);
          const analyticsRes = await fetch("/api/analytics");
          if (analyticsRes.ok) {
            const { data: analyticsData } = await analyticsRes.json();
            setAnalytics(analyticsData);
          }
        } else {
          loadDemoData();
        }
      } else {
        loadDemoData();
      }
    } catch {
      loadDemoData();
    }
    setLoading(false);
  };

  const loadDemoData = () => {
    const demo = getDemoData();
    setProjects([demo.project]);
    setAnalytics(demoAnalytics);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold"
          >
            Dashboard
          </motion.h1>
          <p className="text-zinc-400 mt-1">
            Monitor your AI features and simulation results
          </p>
        </div>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {analytics && <StatsCards data={analytics} />}

      <div>
        <h2 className="text-lg font-semibold mb-4">Projects</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No projects yet"
            description="Create your first project to start testing AI features with simulated scenarios."
            actionLabel="Create Project"
            onAction={() => setCreateOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>

      <CreateProjectDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(project: Project) => addProject(project)}
      />
    </div>
  );
}
