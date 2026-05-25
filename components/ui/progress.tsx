"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const trackVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-white/8",
  {
    variants: {
      size: {
        xs: "h-[3px]",
        sm: "h-[5px]",
        md: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: { size: "md" },
  }
);

const fillVariants = cva(
  "h-full rounded-full transition-all duration-700 ease-out",
  {
    variants: {
      color: {
        violet:  "bg-gradient-to-r from-violet-600 to-violet-400",
        blue:    "bg-gradient-to-r from-blue-600 to-blue-400",
        indigo:  "bg-gradient-to-r from-indigo-600 to-indigo-400",
        cyan:    "bg-gradient-to-r from-cyan-600 to-cyan-400",
        emerald: "bg-gradient-to-r from-emerald-600 to-emerald-400",
        amber:   "bg-gradient-to-r from-amber-500 to-amber-300",
        rose:    "bg-gradient-to-r from-rose-600 to-rose-400",
        primary: "bg-gradient-to-r from-violet-600 to-indigo-500",
      },
    },
    defaultVariants: { color: "primary" },
  }
);

export interface ProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof trackVariants>,
    VariantProps<typeof fillVariants> {
  value: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, size, color, ...props }, ref) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(trackVariants({ size }), className)}
        {...props}
      >
        <div
          className={cn(fillVariants({ color }))}
          style={{ width: `${pct}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
