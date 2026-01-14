"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leadingIcon?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leadingIcon, ...props }, ref) => {
    return (
      <label
        className={cn(
          "flex w-full min-h-[44px] items-center gap-3 rounded-full border border-beige bg-white/40 px-5 py-2.5 text-sm text-dark shadow-[inset_0_2px_6px_rgba(70,32,15,0.05)] backdrop-blur-md focus-within:border-latte focus-within:ring-4 focus-within:ring-latte/10 transition-all sm:py-2.5 sm:min-h-0",
          className,
        )}
      >
        {leadingIcon && <span className="text-latte">{leadingIcon}</span>}
        <input
          ref={ref}
          className="w-full bg-transparent text-base text-dark placeholder:text-caramel/40 focus:outline-none"
          {...props}
        />
      </label>
    );
  },
);

Input.displayName = "Input";


