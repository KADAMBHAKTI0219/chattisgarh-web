import fetchApi from "./client";

export const authService = {
  // 1. Register new Creator account
  async register(userData) {
    return await fetchApi("/auth/register", { method: "POST", body: userData });
  },

  // 2. Login User / Admin
  async login(email, password) {
    return await fetchApi("/auth/login", { method: "POST", body: { email, password } });
  },

  // 3. Refresh Access Token
  async refreshToken(refreshToken) {
    return await fetchApi("/auth/refresh-token", { method: "POST", body: { refreshToken } });
  },

  // 4. Logout User (Revoke refresh token)
  async logout(token) {
    return await fetchApi("/auth/logout", { method: "POST", token });
  },

  // 5. Forgot Password (Request Reset Link)
  async forgotPassword(email) {
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: "Please enter your email address." };
    }

    try {
      // Primary backend endpoint: POST /auth/forgot-password
      const res = await fetchApi("/auth/forgot-password", {
        method: "POST",
        body: { email: cleanEmail, emailId: cleanEmail },
        skipToken: true
      });

      if (res && (res.success || res.status === 200 || res.status === 201)) {
        return {
          success: true,
          message: res.message || "Password reset instructions sent to your email address."
        };
      }

      // Return exact error message from backend if request failed (e.g. 400 User not found)
      if (res && res.message) {
        return {
          success: false,
          message: res.message
        };
      }

      return { success: false, message: "Failed to send reset email. Please verify your email address." };
    } catch (err) {
      return { success: false, message: err?.message || "Failed to send reset email." };
    }
  },

  // 6. Reset Password with Token
  async resetPassword(token, newPassword) {
    const cleanToken = String(token || "").trim();
    const cleanPassword = String(newPassword || "").trim();

    if (!cleanToken || !cleanPassword) {
      return { success: false, message: "Reset token and new password are required." };
    }

    try {
      const res = await fetchApi("/auth/reset-password", {
        method: "POST",
        body: { token: cleanToken, resetToken: cleanToken, newPassword: cleanPassword, password: cleanPassword },
        skipToken: true
      });

      if (res && (res.success || res.status === 200 || res.status === 201)) {
        return {
          success: true,
          message: res.message || "Password reset successfully. You can now login."
        };
      }

      if (res && res.message) {
        return {
          success: false,
          message: res.message
        };
      }

      return { success: false, message: "Failed to reset password. Link may be invalid or expired." };
    } catch (err) {
      return { success: false, message: err?.message || "Failed to reset password." };
    }
  },

  // 7. Change Password (Authenticated)
  async changePassword(currentPassword, newPassword, token) {
    return await fetchApi("/auth/change-password", { method: "PUT", body: { currentPassword, newPassword }, token });
  },
};

export default authService;
