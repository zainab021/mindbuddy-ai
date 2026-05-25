import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[100px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none resize-none transition-colors focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
