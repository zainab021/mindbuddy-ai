import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-glow-xs hover:opacity-90 hover:shadow-glow-sm",
        secondary:
          "bg-secondary text-foreground border border-border hover:bg-accent hover:border-white/15",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-accent",
        outline:
          "border border-white/10 text-foreground bg-transparent hover:bg-accent hover:border-white/20",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link:
          "text-violet-400 underline-offset-4 hover:underline hover:text-violet-300 p-0 h-auto",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm:      "h-8 px-3 text-xs rounded-lg",
        lg:      "h-12 px-7 text-base rounded-2xl",
        icon:    "h-9 w-9 rounded-xl",
        "icon-sm": "h-7 w-7 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
