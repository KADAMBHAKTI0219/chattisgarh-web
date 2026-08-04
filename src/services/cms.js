import fetchApi from "./client";

export const cmsService = {
  // 1. Get All CMS Sections
  async getAllCMS() {
    return await fetchApi("/cms/all", { method: "GET" });
  },

  // 2. Get CMS Section Content by Key
  async getCMSSection(key) {
    return await fetchApi(`/cms/${encodeURIComponent(key)}`, { method: "GET" });
  },

  // 3. Update CMS Section Content (Admin)
  async updateCMSSection(key, cmsData, token) {
    return await fetchApi(`/cms/${encodeURIComponent(key)}`, { method: "PUT", body: cmsData, token });
  },
};

export default cmsService;
