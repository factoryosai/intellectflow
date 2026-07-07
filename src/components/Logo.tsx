import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
  size = "md",
}: {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const box = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const icon = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "bg-gradient-brand flex items-center justify-center rounded-xl text-primary-foreground shadow-[var(--shadow-brand)]",
          box,
        )}
      >
        <Zap className={cn(icon, "fill-current")} />
      </div>
      {showText && (
        <div className="leading-none">
          <span className={cn("font-black tracking-tight", text)}>
            Intellect<span className="text-gradient-brand">Flow</span>
          </span>
        </div>
      )}
    </div>
  );
}
