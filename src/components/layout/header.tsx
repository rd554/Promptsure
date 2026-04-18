"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store";

export function Header() {
  const { activeJobs } = useAppStore();
  const runningJobs = activeJobs.filter((j) => j.status === "running").length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl px-6">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search projects, scenarios..."
            className="pl-9 bg-zinc-900/50 border-zinc-800 h-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {runningJobs > 0 && (
          <Badge variant="info" className="animate-pulse">
            {runningJobs} job{runningJobs > 1 ? "s" : ""} running
          </Badge>
        )}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-violet-500" />
        </Button>
      </div>
    </header>
  );
}
