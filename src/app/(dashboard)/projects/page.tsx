"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, FolderOpen, Search, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/dashboard/project-card";
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { useAppStore } from "@/store";
import type { Project } from "@/types";

export default function ProjectsPage() {
  const { projects, setProjects, addProject } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const { data } = await res.json();
        setProjects(data || []);
      }
    } catch {}
    setLoading(false);
  };

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold"
          >
            Projects
          </motion.h1>
          <p className="text-zinc-400 mt-1">
            All your AI feature projects in one place
          </p>
        </div>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Badge variant="default">
          {filtered.length} of {projects.length}
        </Badge>
        <div className="ml-auto flex items-center gap-1 rounded-lg border border-zinc-800 p-1">
          <button
            onClick={() => setView("grid")}
            className={`rounded-md p-1.5 transition-colors ${
              view === "grid" ? "bg-zinc-800 text-zinc-100" : "text-zinc-500"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`rounded-md p-1.5 transition-colors ${
              view === "list" ? "bg-zinc-800 text-zinc-100" : "text-zinc-500"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={projects.length === 0 ? "No projects yet" : "No matches"}
          description={
            projects.length === 0
              ? "Create your first project to start testing AI features with simulated scenarios."
              : "Try a different search term."
          }
          actionLabel={projects.length === 0 ? "Create Project" : undefined}
          onAction={projects.length === 0 ? () => setCreateOpen(true) : undefined}
        />
      ) : (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-2"
          }
        >
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}

      <CreateProjectDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(project: Project) => addProject(project)}
      />
    </div>
  );
}
