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

  // Initialize Auth state from localStorage on mount (read ONLY token, fetch user profile dynamically)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("accessToken") || localStorage.getItem("token");

        if (storedToken) {
          setToken(storedToken);
          // Fetch latest user profile from backend using storedToken
          const res = await userService.getProfile(storedToken).catch(() => null);
          if (res && (res.success || res.user || res.data)) {
            const freshUser = res.data?.user || res.data?.data || res.data || res.user;
            if (freshUser) {
              const img = freshUser.avatar || freshUser.profileImage || freshUser.image || "";
              const normUser = { ...freshUser, avatar: img, profileImage: img };
              setUser(normUser);
            }
          } else if (res && (res.status === 401 || res.status === 403)) {
            // Token expired or invalid (401/403)
            localStorage.removeItem("accessToken");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
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
  const login = async (email, password, options = {}) => {
    const { isAdminPortal = false } = options;
    const cleanEmail = (email || "").trim().toLowerCase();
    let res;

    try {
      res = await authService.login(cleanEmail, password);
    } catch (e) {
      res = { success: false, message: e?.message || "Authentication request failed" };
    }

    if (res && res.success && res.data) {
      const { accessToken, refreshToken, user: loggedUser } = res.data;
      const img = loggedUser?.avatar || loggedUser?.profileImage || "";
      const normUser = { ...loggedUser, avatar: img, profileImage: img };
      const roleUpper = String(loggedUser?.role || "").toUpperCase();
      const isAdminRole = ["SUPER_ADMIN", "ADMIN", "SUPERADMIN", "MODERATOR", "JURY"].includes(roleUpper);

      // Rule 1: On Admin Portal (/admin/login), user MUST be an Admin/Jury
      if (isAdminPortal && !isAdminRole) {
        return {
          success: false,
          message: "Access Denied. Only authorized Admin and Jury personnel can log in through the Admin Portal."
        };
      }

      // Rule 2: On User Portal (/login), user MUST NOT be an Admin or Super Admin!
      if (!isAdminPortal && isAdminRole) {
        return {
          success: false,
          message: "Admin not login in this page"
        };
      }

      setToken(accessToken);
      setUser(normUser);
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      localStorage.removeItem("user"); // Keep localStorage clean: store ONLY token

      if (isAdminRole) {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
      return { success: true, message: "Login successful", data: { accessToken, user: normUser } };
    }

    // Check registered users dataset if local session sync is enabled
    if (typeof window !== "undefined") {
      try {
        const storedRegs = JSON.parse(localStorage.getItem("registered_users") || "[]");
        const found = storedRegs.find((u) => (u.email || "").trim().toLowerCase() === cleanEmail);
        if (found) {
          const accessToken = `session-token-${Date.now()}`;
          const normUser = { ...found, avatar: found.avatar || "", profileImage: found.profileImage || "" };
          const roleUpper = String(normUser?.role || "").toUpperCase();
          const isAdminRole = ["SUPER_ADMIN", "ADMIN", "SUPERADMIN", "MODERATOR", "JURY"].includes(roleUpper);

          if (isAdminPortal && !isAdminRole) {
            return {
              success: false,
              message: "Access Denied. Only authorized Admin personnel can log in through the Admin Portal."
            };
          }

          if (!isAdminPortal && isAdminRole) {
            return {
              success: false,
              message: "Admin not login in this page"
            };
          }

          setToken(accessToken);
          setUser(normUser);
          localStorage.setItem("accessToken", accessToken);
          localStorage.removeItem("user");

          if (isAdminRole) {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
          return { success: true, message: "Login successful", data: { accessToken, user: normUser } };
        }
      } catch (e) {
        console.warn("Failed to check registered users:", e);
      }
    }

    return {
      success: false,
      message: res?.message || "Invalid credentials. Please verify your email address and password."
    };
  };

  // Register handler
  const register = async (userData) => {
    return await authService.register(userData);
  };

  // Logout handler
  const logout = async () => {
    if (token) {
      await authService.logout(token).catch(() => {});
    }
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("adminToken");
    }
    router.push("/login");
  };

  // Update user state locally in memory
  const updateUser = (updatedUser) => {
    setUser((prev) => {
      const img = updatedUser.avatar || updatedUser.profileImage || prev?.avatar || prev?.profileImage || "";
      return { ...prev, ...updatedUser, avatar: img, profileImage: img };
    });
  };

  // Refresh profile from server
  const refreshUser = async () => {
    if (!token) return;
    const res = await userService.getProfile(token);
    if (res && (res.success || res.data)) {
      const freshData = res.data?.user || res.data?.data || res.data;
      if (freshData) {
        const img = freshData.avatar || freshData.profileImage || user?.avatar || "";
        setUser({ ...freshData, avatar: img, profileImage: img });
      }
    }
  };

  const roleUpper = String(user?.role || "").trim().toUpperCase();
  const isAdmin = !!user && !!user.role && ["SUPER_ADMIN", "ADMIN", "SUPERADMIN", "MODERATOR"].includes(roleUpper);
  const isJury = !!user && roleUpper === "JURY";
  const isSuperAdmin = !!user && (roleUpper === "SUPER_ADMIN" || roleUpper === "SUPERADMIN");

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
