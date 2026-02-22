import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Map, LogOut, User } from "lucide-react";
import { RouteMeshLogo } from "./RouteMeshLogo";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, userEmail } = useAuth();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Visualizer", path: "/visualizer", icon: Map },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0d1117]/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <RouteMeshLogo />
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                  location.pathname === item.path
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative flex items-center gap-2 h-10 rounded-full border border-white/5 bg-[#161b22] px-4 hover:bg-[#1f242c] hover:border-emerald-500/30 transition-all"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                <User className="h-3.5 w-3.5 text-emerald-500" />
              </div>
              <span className="text-sm font-medium text-gray-300">
                {userEmail || "operator@routemesh.io"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 border-white/10 bg-[#161b22] text-gray-300">
            <DropdownMenuItem
              onClick={() => { logout(); navigate("/"); }}
              className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}