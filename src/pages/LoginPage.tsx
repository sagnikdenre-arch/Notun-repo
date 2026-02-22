import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { RouteMeshLogo } from "@/components/RouteMeshLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) { setError("Enter a valid email"); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters"); return; }
    if (login(email, password)) {
      navigate("/dashboard");
    } else {
      setError("Authentication failed");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center grid-bg">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="glass-strong rounded-xl p-8 glow-emerald">
          <div className="mb-6 flex flex-col items-center gap-2">
            <RouteMeshLogo />
            <p className="mt-1 text-sm text-muted-foreground">Secure Grid Access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="operator@routemesh.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <Button type="submit" className="w-full">
              Access Grid
            </Button>
          </form>

          <p className="mt-4 text-center text-[10px] font-mono text-muted-foreground">
            AES-256 Encrypted · TLS 1.3
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
