import fetchApi from "./client";

/**
 * Utility to generate URL-safe slug from a title string
 */
export const generateSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // Replace spaces & non-word chars with -
    .replace(/^-+|-+$/g, "");   // Trim leading & trailing hyphen
};

export const newsService = {
  /**
   * 1. Get All Published News Articles (Public)
   * GET /news
   * Query params: page, limit, status, isFeatured, search, tag
   */
  async getAllNews(params = {}) {
    return await fetchApi("/news", { method: "GET", params });
  },

  /**
   * 2. Get News Article Details by Slug (Public)
   * GET /news/:slug
   */
  async getNewsBySlug(slug) {
    if (!slug) return { success: false, message: "Invalid slug parameter" };
    return await fetchApi(`/news/${encodeURIComponent(slug)}`, { method: "GET" });
  },

  /**
   * 3. Create News Article (Admin)
   * POST /news
   * Body: { title, slug, summary, content, coverImage, status, scheduledAt, isFeatured, tags, seo }
   */
  async createNews(newsData, token) {
    const payload = {
      ...newsData,
      slug: newsData.slug ? newsData.slug.toLowerCase().trim() : generateSlug(newsData.title),
    };
    return await fetchApi("/news", { method: "POST", body: payload, token });
  },

  /**
   * 4. Update News Article by ID (Admin)
   * PUT /news/:id
   * Body: Partial news object
   */
  async updateNews(id, newsData, token) {
    if (!id) return { success: false, message: "Invalid news ID parameter" };
    const payload = { ...newsData };
    if (payload.slug) {
      payload.slug = payload.slug.toLowerCase().trim();
    }
    return await fetchApi(`/news/${encodeURIComponent(id)}`, { method: "PUT", body: payload, token });
  },

  /**
   * 5. Delete News Article by ID (Admin)
   * DELETE /news/:id
   */
  async deleteNews(id, token) {
    if (!id) return { success: false, message: "Invalid news ID parameter" };
    return await fetchApi(`/news/${encodeURIComponent(id)}`, { method: "DELETE", token });
  },
};

export default newsService;

