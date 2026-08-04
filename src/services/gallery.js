import fetchApi from "./client";

export const galleryService = {
  // 1. Get Gallery Albums & Items (Public)
  async getAlbums(params = {}) {
    return await fetchApi("/gallery", { method: "GET", params });
  },

  // 2. Get Gallery Album Details by Slug (Public)
  async getAlbumBySlug(slug) {
    return await fetchApi(`/gallery/${encodeURIComponent(slug)}`, { method: "GET" });
  },

  // 3. Create Gallery Album (Admin)
  async createAlbum(albumData, token) {
    return await fetchApi("/gallery", { method: "POST", body: albumData, token });
  },

  // 4. Add Media Items to Album (Admin)
  async addMediaToAlbum(id, mediaData, token) {
    return await fetchApi(`/gallery/${encodeURIComponent(id)}/media`, { method: "POST", body: mediaData, token });
  },

  // 5. Delete Gallery Album (Admin)
  async deleteAlbum(id, token) {
    return await fetchApi(`/gallery/${encodeURIComponent(id)}`, { method: "DELETE", token });
  },
};

export default galleryService;
