"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthUser = {
  id: number;
  username: string;
  nombreVisualizacion?: string;
  fotoPerfil?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext =
  createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  useEffect(() => {
    const stored =
      localStorage.getItem("authUser");

    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleSetUser = (
    newUser: AuthUser | null
  ) => {
    setUser(newUser);

    if (newUser) {
      localStorage.setItem(
        "authUser",
        JSON.stringify(newUser)
      );
    } else {
      localStorage.removeItem("authUser");
    }
  };

  const logout = () => {
    handleSetUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: handleSetUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe usarse dentro de AuthProvider"
    );
  }

  return context;
}