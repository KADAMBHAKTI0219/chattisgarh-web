import fetchApi from "./client";

export const applicationService = {
  // 1. Create Nomination Application Draft
  async createApplication(data, token) {
    return await fetchApi("/applications", { method: "POST", body: data, token });
  },

  // 2. Submit Application for Review
  async submitApplication(id, token) {
    return await fetchApi(`/applications/${encodeURIComponent(id)}/submit`, { method: "POST", token });
  },

  // 3. Update Nomination Draft Details
  async updateDraft(id, data, token) {
    return await fetchApi(`/applications/${encodeURIComponent(id)}/draft`, { method: "PUT", body: data, token });
  },

  // 4. Delete Nomination Draft
  async deleteDraft(id, token) {
    return await fetchApi(`/applications/${encodeURIComponent(id)}/draft`, { method: "DELETE", token });
  },

  // 5. Upload Attachment to Nomination Application
  async uploadMedia(id, formData, token) {
    return await fetchApi(`/applications/${encodeURIComponent(id)}/upload`, { method: "POST", body: formData, token });
  },

  // 6. Get Applications (Filtered by status, category, district, search, etc.)
  async getApplications(params = {}, token = null) {
    return await fetchApi("/applications", { method: "GET", params, token });
  },

  // 7. Get Application Details by ID
  async getApplicationById(id, token = null) {
    return await fetchApi(`/applications/${encodeURIComponent(id)}`, { method: "GET", token });
  },

  // 8. Update Application Status (Admin / Jury Transition)
  async updateStatus(id, status, remarks, token) {
    return await fetchApi(`/applications/${encodeURIComponent(id)}/status`, { method: "PUT", body: { status, remarks }, token });
  },
};

export default applicationService;
