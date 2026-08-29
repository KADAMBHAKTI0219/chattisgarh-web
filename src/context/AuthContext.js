"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { userService } from "@/services/user";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize Auth state from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            try {
              const parsed = JSON.parse(storedUser);
              const img = parsed.avatar || parsed.profileImage || "";
              setUser({ ...parsed, avatar: img, profileImage: img });
            } catch (e) {
              console.error("Failed to parse stored user json:", e);
            }
          }
          // Fetch latest profile from backend to ensure state validity
          const res = await userService.getProfile(storedToken);
          if (res.success && res.data) {
            const freshUser = res.data.user || res.data.data || res.data;
            const img =
              freshUser.avatar ||
              freshUser.profileImage ||
              freshUser.image ||
              (storedUser ? JSON.parse(storedUser)?.avatar || JSON.parse(storedUser)?.profileImage : "") ||
              "";
            const normUser = { ...freshUser, avatar: img, profileImage: img };
            setUser(normUser);
            localStorage.setItem("user", JSON.stringify(normUser));
          } else if (res.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("accessToken");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.data) {
      const { accessToken, user: loggedUser } = res.data;
      const img = loggedUser?.avatar || loggedUser?.profileImage || "";
      const normUser = { ...loggedUser, avatar: img, profileImage: img };
      setToken(accessToken);
      setUser(normUser);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(normUser));

      // Redirect Admin / Super Admin / Moderator / Jury / Creator to /dashboard
      const roleUpper = String(loggedUser?.role || "").toUpperCase();
      if (["SUPER_ADMIN", "ADMIN", "MODERATOR", "JURY"].includes(roleUpper)) {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    }
    return res;
  };

  // Register handler
  const register = async (userData) => {
    return await authService.register(userData);
  };

  // Logout handler
  const logout = async () => {
    if (token) {
      await authService.logout(token);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Update user state locally & sync with storage
  const updateUser = (updatedUser) => {
    setUser((prev) => {
      const img = updatedUser.avatar || updatedUser.profileImage || prev?.avatar || prev?.profileImage || "";
      const newObj = { ...prev, ...updatedUser, avatar: img, profileImage: img };
      localStorage.setItem("user", JSON.stringify(newObj));
      return newObj;
    });
  };

  // Refresh profile from server
  const refreshUser = async () => {
    if (!token) return;
    const res = await userService.getProfile(token);
    if (res.success && res.data) {
      const img = res.data.avatar || res.data.profileImage || user?.avatar || "";
      const normUser = { ...res.data, avatar: img, profileImage: img };
      setUser(normUser);
      localStorage.setItem("user", JSON.stringify(normUser));
    }
  };

  const roleUpper = String(user?.role || "").trim().toUpperCase();
  const isAdmin = !!user && !!user.role && ["SUPER_ADMIN", "ADMIN", "MODERATOR"].includes(roleUpper);
  const isJury = !!user && roleUpper === "JURY";
  const isSuperAdmin = !!user && roleUpper === "SUPER_ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isSuperAdmin,
        isAdmin,
        isJury,
        isCreator: !isAdmin && !isJury,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
