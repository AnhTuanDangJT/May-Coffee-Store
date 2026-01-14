import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = ({ className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_20px_60px_rgba(15,8,5,0.35)] backdrop-blur",
        className,
      )}
      {...props}
    />
  );
};















