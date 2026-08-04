import fetchApi from "./client";

export const contactService = {
  // 1. Submit Public Query / Grievance (Public)
  async submitQuery(contactData) {
    return await fetchApi("/contact/submit", { method: "POST", body: contactData });
  },

  // 2. Get All Support Queries (Admin / Moderator)
  async getAllQueries(params = {}, token) {
    return await fetchApi("/contact/all", { method: "GET", params, token });
  },

  // 3. Resolve Support Query (Admin / Moderator)
  async resolveQuery(id, resolutionData, token) {
    return await fetchApi(`/contact/${encodeURIComponent(id)}/resolve`, { method: "PUT", body: resolutionData, token });
  },
};

export default contactService;
