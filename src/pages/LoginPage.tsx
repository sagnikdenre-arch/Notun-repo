import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, AlertCircle } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate a brief network delay for realism
    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError("Invalid credentials. Access Denied.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 bg-dots">
      <Card className="w-full max-w-md glass border-border/50 glow-emerald">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="p-3 bg-primary/10 rounded-full mb-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">RouteMesh Admin</CardTitle>
          <CardDescription>
            Enter your credentials to access the campus grid
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm animate-shake">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="avrajitbanerjee09@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Security Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full font-semibold" 
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Authorize Access"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;