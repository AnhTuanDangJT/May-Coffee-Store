import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "amber" | "rose" | "emerald" | "slate";
};

const toneMap: Record<NonNullable<BadgeProps["tone"]>, string> = {
  amber: "bg-latte/20 text-espresso border-latte/30",
  rose: "bg-[#fde7e0] text-[#b04e45] border-[#f2a8a2]", // keeping rose for special highlight but will align if used
  emerald: "bg-beige/40 text-espresso border-beige",
  slate: "bg-cream text-caramel border-beige/60",
};

export const Badge = ({ className, tone = "slate", ...props }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-wider",
      toneMap[tone],
      className,
    )}
    {...props}
  />
);


