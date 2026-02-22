import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { RouteMeshLogo } from "@/components/RouteMeshLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Loader2, Shield } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.includes("@")) { setError("Enter a valid email"); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters"); return; }

    setIsLoading(true);

    // Simulate a secure network handshake for realism
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (login(email, password)) {
      navigate("/dashboard");
    } else {
      setError("Grid access denied. Verify credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center grid-bg">
      {/* Ambient emerald glow behind the card */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[100px]" />

      <div className="relative z-10 w-full max-w-sm px-4">
        {/* Main Card */}
        <div className="rounded-2xl border border-white/5 bg-[#161b22]/80 p-8 shadow-[0_0_30px_rgba(16,185,129,0.05)] backdrop-blur-md">
          
          <div className="mb-8 flex flex-col items-center gap-2">
            <RouteMeshLogo />
            <div className="flex items-center gap-1.5 mt-1">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Secure Grid Access
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-gray-400">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="operator@routemesh.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-gray-800 bg-[#0d1117] pl-10 text-gray-200 placeholder:text-gray-600 focus-visible:ring-emerald-500/50"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-gray-400">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-gray-800 bg-[#0d1117] pl-10 text-gray-200 placeholder:text-gray-600 focus-visible:ring-emerald-500/50"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && <p className="text-xs text-destructive text-center">{error}</p>}

            <Button 
              type="submit" 
              className="mt-2 h-11 w-full bg-[#10b981] text-black hover:bg-[#059669] font-medium" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Access Grid"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-[11px] text-gray-500">
            Protected by RouteMesh Security Protocol v2.1
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;