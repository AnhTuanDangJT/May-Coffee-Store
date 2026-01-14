"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type RatingStarsProps = {
  value: number;
  className?: string;
  interactive?: boolean;
  onSelect?: (value: number) => void;
};

export const RatingStars = ({
  value,
  className,
  interactive = false,
  onSelect,
}: RatingStarsProps) => {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index + 1 <= value;
        return (
          <motion.button
            key={index}
            type="button"
            whileHover={interactive ? { scale: 1.2, rotate: 12 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            className={cn(
              "relative transition-colors duration-300",
              interactive ? "cursor-pointer" : "cursor-default",
              filled ? "text-latte" : "text-caramel/20"
            )}
            onClick={() => interactive && onSelect?.(index + 1)}
            aria-label={`rating-${index + 1}`}
          >
            <Star
              size={interactive ? 32 : 18}
              fill={filled ? "currentColor" : "transparent"}
              strokeWidth={filled ? 0 : 2}
              className="drop-shadow-sm"
            />
            {interactive && filled && (
              <motion.div
                layoutId="star-glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-latte/20 blur-md rounded-full -z-10"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};














