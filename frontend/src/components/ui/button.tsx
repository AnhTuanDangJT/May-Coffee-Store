"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "xl";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-espresso text-cream shadow-xl shadow-espresso/10 hover:bg-dark hover:shadow-espresso/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 ease-[0.22,1,0.36,1] group",
  secondary:
    "bg-beige/30 text-espresso border border-beige/40 backdrop-blur-md hover:bg-beige/50 hover:border-beige hover:shadow-lg transition-all duration-500",
  outline:
    "border border-espresso/20 bg-transparent text-espresso hover:border-espresso/40 hover:bg-espresso/[0.03] transition-all duration-500",
  ghost:
    "bg-transparent text-espresso hover:bg-beige/20 transition-all duration-500",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-sm px-4 py-2 min-h-[44px] sm:min-h-0",
  md: "text-base px-5 py-3 min-h-[44px] sm:py-2.5 sm:min-h-0",
  lg: "text-lg px-6 py-3.5 min-h-[44px] sm:py-3 sm:min-h-0",
  xl: "text-xl px-10 py-5 min-h-[56px] sm:py-4 sm:min-h-0",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      icon,
      children,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const content = (
      <>
        {icon}
        {children}
      </>
    );

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-60 disabled:cursor-not-allowed",
            variantClasses[variant],
            sizeClasses[size],
            className,
          )}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-60 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";

