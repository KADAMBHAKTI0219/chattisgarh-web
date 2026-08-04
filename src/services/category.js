import fetchApi from "./client";

export const categoryService = {
  // 1. Get All Award Categories (Public)
  async getCategories(params = {}) {
    return await fetchApi("/categories", { method: "GET", params });
  },

  // 2. Get Category Details by Slug (Public)
  async getCategoryBySlug(slug) {
    return await fetchApi(`/categories/${encodeURIComponent(slug)}`, { method: "GET" });
  },

  // 3. Create New Award Category (Admin)
  async createCategory(data, token) {
    return await fetchApi("/categories", { method: "POST", body: data, token });
  },

  // 4. Update Award Category (Admin)
  async updateCategory(id, data, token) {
    return await fetchApi(`/categories/${encodeURIComponent(id)}`, { method: "PUT", body: data, token });
  },

  // 5. Delete Award Category (Admin)
  async deleteCategory(id, token) {
    return await fetchApi(`/categories/${encodeURIComponent(id)}`, { method: "DELETE", token });
  },
};

export default categoryService;
