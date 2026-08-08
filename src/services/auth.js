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

  // 6. Forgot Password (Request Reset Link)
  async forgotPassword(email) {
    return await fetchApi("/auth/forgot-password", { method: "POST", body: { email } });
  },

  // 7. Reset Password with Token
  async resetPassword(token, newPassword) {
    return await fetchApi("/auth/reset-password", { method: "POST", body: { token, newPassword } });
  },

  // 8. Change Password (Authenticated)
  async changePassword(currentPassword, newPassword, token) {
    return await fetchApi("/auth/change-password", { method: "PUT", body: { currentPassword, newPassword }, token });
  },
};

export default authService;
