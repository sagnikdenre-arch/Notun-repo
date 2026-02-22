import { Activity } from "lucide-react";

export function RouteMeshLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 glow-emerald">
        <Activity className="h-5 w-5 text-primary" />
      </div>
      <span className="text-lg font-semibold tracking-tight text-foreground">
        Route<span className="text-primary text-glow">Mesh</span>
      </span>
    </div>
  );
}
