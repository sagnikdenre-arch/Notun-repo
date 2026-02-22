import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  userEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define all your valid hackathon demo accounts here
const VALID_CREDENTIALS = [
  { email: "operator@routemesh.io", password: "ghosts123" },
  { email: "medic@routemesh.io", password: "medic123" },
  { email: "admin@routemesh.io", password: "admin123" }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage to persist login across page reloads
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("routeMesh_auth") === "true";
  });
  
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem("routeMesh_email");
  });

  const login = (email: string, password: string) => {
    // Check if the entered credentials match any user in our array
    const isValidUser = VALID_CREDENTIALS.some(
      (user) => user.email === email && user.password === password
    );

    if (isValidUser) {
      setIsAuthenticated(true);
      setUserEmail(email);
      
      // Save to localStorage so you don't get logged out on refresh
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