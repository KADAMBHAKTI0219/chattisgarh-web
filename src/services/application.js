import fetchApi from "./client";

export const applicationService = {
  // 1. Get Applications (Filtered by status, category, district)
  async getApplications(paramsOrToken = {}, token = null) {
    let params = paramsOrToken;
    let authToken = token;
    if (typeof paramsOrToken === "string") {
      authToken = paramsOrToken;
      params = {};
    }
    return await fetchApi("/applications", { method: "GET", params, token: authToken });
  },

  // 2. Create Nomination Application Draft
  async createApplication(data, token) {
    return await fetchApi("/applications", { method: "POST", body: data, token });
  },

  // 3. Get Application Details by ID
  async getApplicationById(id, token = null) {
    return await fetchApi(`/applications/${encodeURIComponent(id)}`, { method: "GET", token });
  },

  // 4. Submit Application for Review
  async submitApplication(id, token) {
    return await fetchApi(`/applications/${encodeURIComponent(id)}/submit`, { method: "POST", token });
  },

  // 5. Update Nomination Draft Details
  async updateDraft(id, data, token) {
    return await fetchApi(`/applications/${encodeURIComponent(id)}/draft`, { method: "PUT", body: data, token });
  },

  // 6. Delete Nomination Draft
  async deleteDraft(id, token) {
    return await fetchApi(`/applications/${encodeURIComponent(id)}/draft`, { method: "DELETE", token });
  },

  // 7. Upload Attachment to Nomination Application
  async uploadMedia(id, formData, token) {
    return await fetchApi(`/applications/${encodeURIComponent(id)}/upload`, { method: "POST", body: formData, token });
  },

  // 8. Update Application Status (Admin)
  async updateStatus(id, status, remarks, token) {
    return await fetchApi(`/applications/${encodeURIComponent(id)}/status`, { method: "PUT", body: { status, remarks }, token });
  },

  // Alias for updateApplicationStatus
  async updateApplicationStatus(id, dataOrStatus, tokenOrRemarks) {
    let payload = {};
    let token = null;

    if (typeof dataOrStatus === "object") {
      payload = dataOrStatus;
      token = tokenOrRemarks;
    } else {
      payload = { status: dataOrStatus, remarks: tokenOrRemarks };
    }

    return await fetchApi(`/applications/${encodeURIComponent(id)}/status`, { method: "PUT", body: payload, token });
  }
};

export default applicationService;
