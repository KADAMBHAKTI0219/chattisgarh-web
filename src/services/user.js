import fetchApi from "./client";

export const userService = {
  // 1. Get Logged-in User Profile
  async getProfile(token) {
    return await fetchApi("/users/profile", { method: "GET", token });
  },

  // 2. Update Logged-in User Profile
  async updateProfile(profileData, token) {
    return await fetchApi("/users/profile", { method: "PUT", body: profileData, token });
  },

  // 3. Upload User Profile Avatar / Image
  async uploadProfileImage(formData, token) {
    return await fetchApi("/users/profile-image", { method: "POST", body: formData, token });
  },

  // 4. Delete Logged-in User Account
  async deleteAccount(token) {
    return await fetchApi("/users/account", { method: "DELETE", token });
  },

  // 5. Get All Users (Admin only)
  async getAllUsers(paramsOrToken = {}, token = null) {
    let params = paramsOrToken;
    let authToken = token;
    if (typeof paramsOrToken === "string") {
      authToken = paramsOrToken;
      params = {};
    }

    // Try /users/all
    let res = await fetchApi("/users/all", { method: "GET", params, token: authToken });
    if (res && res.success && res.data) return res;

    // Fallback 1: /users
    res = await fetchApi("/users", { method: "GET", params, token: authToken });
    if (res && res.success && res.data) return res;

    // Fallback 2: /admin/users
    res = await fetchApi("/admin/users", { method: "GET", params, token: authToken });
    return res;
  },
};

export default userService;
