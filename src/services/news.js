import fetchApi from "./client";

export const newsService = {
  // 1. Get All Published News Articles (Public)
  async getAllNews(params = {}) {
    return await fetchApi("/news", { method: "GET", params });
  },

  // 2. Get News Article Details by Slug (Public)
  async getNewsBySlug(slug) {
    return await fetchApi(`/news/${encodeURIComponent(slug)}`, { method: "GET" });
  },

  // 3. Create News Article (Admin)
  async createNews(newsData, token) {
    return await fetchApi("/news", { method: "POST", body: newsData, token });
  },

  // 4. Update News Article (Admin)
  async updateNews(id, newsData, token) {
    return await fetchApi(`/news/${encodeURIComponent(id)}`, { method: "PUT", body: newsData, token });
  },

  // 5. Delete News Article (Admin)
  async deleteNews(id, token) {
    return await fetchApi(`/news/${encodeURIComponent(id)}`, { method: "DELETE", token });
  },
};

export default newsService;
