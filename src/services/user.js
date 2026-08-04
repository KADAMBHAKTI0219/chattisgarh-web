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
  async getAllUsers(params = {}, token) {
    return await fetchApi("/users/all", { method: "GET", params, token });
  },
};

export default userService;
