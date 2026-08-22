import fetchApi from "./client";

export const categoryService = {
  // 1. Get All Award Categories (Public)
  async getCategories(params = {}) {
    const res = await fetchApi("/categories", { method: "GET", params });
    if (res.success && res.data) {
      let categories = [];
      if (Array.isArray(res.data)) {
        categories = res.data;
      } else if (Array.isArray(res.data.categories)) {
        categories = res.data.categories;
      } else if (Array.isArray(res.data.data)) {
        categories = res.data.data;
      } else if (Array.isArray(res.categories)) {
        categories = res.categories;
      }
      return { ...res, categories };
    }
    return { ...res, categories: res.categories || [] };
  },

  // 2. Get Category Details by Slug (Public)
  async getCategoryBySlug(slug) {
    const res = await fetchApi(`/categories/${encodeURIComponent(slug)}`, { method: "GET" });
    if (res.success && res.data) {
      const category = res.data.category || (res.data._id ? res.data : null);
      return { ...res, category };
    }
    return res;
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

