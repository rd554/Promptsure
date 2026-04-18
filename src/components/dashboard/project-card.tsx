"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Clock, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/shared/score-ring";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const score = project.overall_score || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/projects/${project.id}`}>
        <Card
          glass
          className="group hover:border-violet-500/30 transition-all duration-300 cursor-pointer"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base group-hover:text-violet-300 transition-colors truncate">
                  {project.name}
                </CardTitle>
                <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                  {project.description}
                </p>
              </div>
              <ScoreRing score={score} size={56} strokeWidth={4} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {project.last_run_at && (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(project.last_run_at), {
                      addSuffix: true,
                    })}
                  </div>
                )}
                <Badge variant={score >= 70 ? "success" : score >= 50 ? "warning" : "danger"}>
                  <BarChart2 className="h-3 w-3 mr-1" />
                  {score}/100
                </Badge>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-violet-400 transition-colors" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
