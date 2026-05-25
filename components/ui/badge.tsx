import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
  {
    variants: {
      variant: {
        default:     "border-transparent bg-primary/20 text-primary-foreground",
        secondary:   "border-white/10 bg-white/6 text-muted-foreground",
        violet:      "border-violet-500/25 bg-violet-500/12 text-violet-300",
        blue:        "border-blue-500/25 bg-blue-500/12 text-blue-300",
        indigo:      "border-indigo-500/25 bg-indigo-500/12 text-indigo-300",
        cyan:        "border-cyan-500/25 bg-cyan-500/12 text-cyan-300",
        emerald:     "border-emerald-500/25 bg-emerald-500/12 text-emerald-300",
        amber:       "border-amber-500/25 bg-amber-500/12 text-amber-300",
        rose:        "border-rose-500/25 bg-rose-500/12 text-rose-300",
        pink:        "border-pink-500/25 bg-pink-500/12 text-pink-300",
        orange:      "border-orange-500/25 bg-orange-500/12 text-orange-300",
        destructive: "border-destructive/30 bg-destructive/15 text-rose-300",
        outline:     "border-border bg-transparent text-foreground",
      },
    },
    defaultVariants: { variant: "secondary" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
