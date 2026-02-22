import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  // Updated to Promise<boolean> because API calls are asynchronous
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  userEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define all valid hackathon demo accounts here
const VALID_CREDENTIALS = [
  { email: "avrajitbanerjee09@gmail.com", password: "ghosts123" },
  { email: "operator@routemesh.io", password: "operator123" },
  { email: "admin@routemesh.io", password: "admin123" }
];

export function AuthProvider({ children }: { children: ReactNode }) {
<<<<<<< HEAD
  // Check localStorage on init to see if a token already exists
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem("userEmail"));

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Save the token and email for session persistence
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", email);
        
        setIsAuthenticated(true);
        setUserEmail(email);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
=======
  // Initialize state from localStorage so you don't get logged out on a page refresh during the demo
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
      
      // Save to localStorage
      localStorage.setItem("routeMesh_auth", "true");
      localStorage.setItem("routeMesh_email", email);
      return true;
>>>>>>> c33aed80c7943ef772a993fc19bac0cca0efbae3
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
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