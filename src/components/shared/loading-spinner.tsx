"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function LoadingSpinner({ size = "md", className, label }: LoadingSpinnerProps) {
  const sizeMap = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <motion.div
        className={cn(
          "rounded-full border-2 border-zinc-700 border-t-violet-500",
          sizeMap[size]
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {label && (
        <p className="text-sm text-zinc-400 animate-pulse">{label}</p>
      )}
    </div>
  );
}
