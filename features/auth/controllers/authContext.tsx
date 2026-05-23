"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthUser = {
  id: number;
  username?: string;
  nombreVisualizacion?: string;
  fotoPerfil?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUserState] = useState<AuthUser | null>(null);

  useEffect(() => {
    const authUser = localStorage.getItem("authUser");

    if (authUser) {
      setUserState(JSON.parse(authUser));
      return;
    }

    const userId = localStorage.getItem("userId");

    if (userId) {
      setUserState({
        id: Number(userId),
      });
    }
  }, []);

  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser);

    if (newUser) {
      localStorage.setItem("authUser", JSON.stringify(newUser));
      localStorage.setItem("userId", String(newUser.id));
    } else {
      localStorage.removeItem("authUser");
      localStorage.removeItem("userId");
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}