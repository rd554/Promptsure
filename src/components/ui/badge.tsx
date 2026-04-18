import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-zinc-700 bg-zinc-800 text-zinc-300",
        success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
        danger: "border-red-500/30 bg-red-500/10 text-red-400",
        info: "border-blue-500/30 bg-blue-500/10 text-blue-400",
        purple: "border-violet-500/30 bg-violet-500/10 text-violet-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
