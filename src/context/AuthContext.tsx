import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // PERSISTENCE: Check if user was already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("routeMeshUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string) => {
    // Current live user database for the hackathon
    const VALID_USERS = [
      { email: "avrajitbanerjee09@gmail.com", password: "password123" },
      { email: "operator@routemesh.io", password: "password123" }
    ];

    const found = VALID_USERS.find(u => u.email === email && u.password === password);

    if (found) {
      const userData = { email: found.email };
      setUser(userData);
      localStorage.setItem("routeMeshUser", JSON.stringify(userData)); // Save to storage
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("routeMeshUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
