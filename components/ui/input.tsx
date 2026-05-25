import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-muted-foreground pointer-events-none flex items-center">
            {icon}
          </span>
          <input
            type={type}
            ref={ref}
            className={cn(
              "flex h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
