"use client";

import { motion } from "framer-motion";
import { cn, scoreColor } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
}

export function ScoreRing({
  score,
  size = 80,
  strokeWidth = 6,
  className,
  label,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const strokeColorClass =
    score >= 80
      ? "stroke-emerald-500"
      : score >= 60
      ? "stroke-yellow-500"
      : score >= 40
      ? "stroke-orange-500"
      : "stroke-red-500";

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="stroke-zinc-800"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={strokeColorClass}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeDasharray={circumference}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("text-lg font-bold", scoreColor(score))}>
          {score}
        </span>
      </div>
      {label && (
        <span className="mt-1 text-xs text-zinc-500">{label}</span>
      )}
    </div>
  );
}
