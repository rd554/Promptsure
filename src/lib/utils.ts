import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatLatency(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${ms.toFixed(0)}ms`;
}

export function estimateCost(tokens: number): number {
  return tokens * 0.000002;
}

export function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

export function scoreBgColor(score: number): string {
  if (score >= 80) return "bg-emerald-500/20 border-emerald-500/30";
  if (score >= 60) return "bg-yellow-500/20 border-yellow-500/30";
  if (score >= 40) return "bg-orange-500/20 border-orange-500/30";
  return "bg-red-500/20 border-red-500/30";
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "running":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "queued":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "failed":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
