import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  online: boolean;
  className?: string;
}

export function StatusBadge({ online, className }: StatusBadgeProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "inline-block h-2 w-2 rounded-full",
          online
            ? "bg-primary animate-pulse-online"
            : "bg-rose-status"
        )}
      />
      <span
        className={cn(
          "text-xs font-mono font-medium",
          online ? "text-primary" : "text-rose-status"
        )}
      >
        {online ? "Online" : "Offline"}
      </span>
    </div>
  );
}
