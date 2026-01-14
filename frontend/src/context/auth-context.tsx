"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@/types/user";
import { apiFetch, ApiError } from "@/lib/api";

type AuthContextValue = {
  user: User | null;
  status: "loading" | "idle";
  refresh: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "idle">("loading");

  const fetchMe = useCallback(async () => {
    try {
      // Use silent mode to prevent 401 errors and network errors from being thrown/logged
      const response = await apiFetch<{ data: User } | null>("/api/auth/me", { 
        silent: true,
        method: "GET",
      });
      if (response?.data) {
        setUser(response.data);
      } else {
        // 401, network error, or other auth error - user not authenticated (this is expected)
        setUser(null);
      }
    } catch (error) {
      // This should rarely happen with silent mode, but handle gracefully
      // Network errors and auth errors are handled by silent mode returning null
      if (error instanceof Error && error.name !== "NetworkError") {
        // Only log unexpected errors (not network/auth errors)
        console.error("Auth check error:", error);
      }
      setUser(null);
    } finally {
      setStatus("idle");
    }
  }, []);

  useEffect(() => {
    void fetchMe();
  }, [fetchMe]);

  // Development safety guard: Warn if not using localhost
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
        console.warn(
          "[DEV WARNING] Auth cookies require localhost in development. " +
          `Current hostname: ${window.location.hostname}. ` +
          "Authentication may not work correctly.",
        );
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST", silent: true });
    } catch (error) {
      // Network errors are expected if backend is down - still clear local state
      if (error instanceof Error && error.name !== "NetworkError") {
        console.error("Logout error:", error);
      }
    } finally {
      // Always clear user state, even if logout request failed
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      refresh: fetchMe,
      setUser,
      logout,
    }),
    [user, status, fetchMe, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

