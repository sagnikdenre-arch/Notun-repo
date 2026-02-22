import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  userEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage to persist login across page reloads
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("routeMesh_auth") === "true";
  });
  
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem("routeMesh_email");
  });

  const login = (email: string, password: string) => {
    // Basic validation for the prototype
    if (email && password.length >= 4) {
      setIsAuthenticated(true);
      setUserEmail(email);
      
      // Save to localStorage
      localStorage.setItem("routeMesh_auth", "true");
      localStorage.setItem("routeMesh_email", email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    
    // Clear localStorage
    localStorage.removeItem("routeMesh_auth");
    localStorage.removeItem("routeMesh_email");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}