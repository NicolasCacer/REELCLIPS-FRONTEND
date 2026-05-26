"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const FEED_SEED_STORAGE_KEY = "feedSeed";

function createFeedSeed(): number {
  return Date.now() + Math.floor(Math.random() * 1000000);
}

function parseFeedSeed(seed: string | null): number | null {
  const parsed = Number(seed);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null;
}

type AuthUser = {
  id: number;
  username?: string;
  nombreVisualizacion?: string;
  fotoPerfil?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  feedSeed: number;
  rotateFeedSeed: () => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

function getInitialFeedSeed(): number {
  if (typeof window === "undefined") {
    return createFeedSeed();
  }

  const storedSeed = parseFeedSeed(
    window.localStorage.getItem(FEED_SEED_STORAGE_KEY)
  );

  if (storedSeed) {
    return storedSeed;
  }

  const nextSeed = createFeedSeed();
  window.localStorage.setItem(
    FEED_SEED_STORAGE_KEY,
    String(nextSeed)
  );

  return nextSeed;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUserState] =
    useState<AuthUser | null>(null);
  const [feedSeed, setFeedSeed] =
    useState<number>(getInitialFeedSeed);

  useEffect(() => {
    const authUser = localStorage.getItem("authUser");

    if (authUser) {
      queueMicrotask(() => {
        setUserState(JSON.parse(authUser));
      });
      return;
    }

    const userId = localStorage.getItem("userId");

    if (userId) {
      queueMicrotask(() => {
        setUserState({
          id: Number(userId),
        });
      });
    }
  }, []);

  const rotateFeedSeed = () => {
    const nextSeed = createFeedSeed();
    setFeedSeed(nextSeed);
    window.localStorage.setItem(
      FEED_SEED_STORAGE_KEY,
      String(nextSeed)
    );
  };

  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser);

    if (newUser) {
      window.localStorage.setItem(
        "authUser",
        JSON.stringify(newUser)
      );
      window.localStorage.setItem(
        "userId",
        String(newUser.id)
      );
    } else {
      window.localStorage.removeItem("authUser");
      window.localStorage.removeItem("userId");
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        feedSeed,
        rotateFeedSeed,
        setUser,
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
