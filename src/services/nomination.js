import fetchApi from "./client";

export const nominationService = {
  /**
   * 1. Create Self or Third-Party Nomination (POST /nominations)
   */
  async createNomination(nominationData, token = null) {
    return await fetchApi("/nominations", {
      method: "POST",
      body: nominationData,
      token,
    });
  },

  /**
   * 2. Save Nomination Draft (POST /nominations/draft)
   */
  async saveDraft(draftData, token = null) {
    return await fetchApi("/nominations/draft", {
      method: "POST",
      body: draftData,
      token,
    });
  },

  /**
   * 3. Update Existing Draft (PUT /nominations/:id/draft)
   */
  async updateDraft(id, draftData, token = null) {
    return await fetchApi(`/nominations/${encodeURIComponent(id)}/draft`, {
      method: "PUT",
      body: draftData,
      token,
    });
  },

  /**
   * 4. Submit Nomination Application (POST /nominations/:id/submit)
   */
  async submitNomination(id, token = null) {
    return await fetchApi(`/nominations/${encodeURIComponent(id)}/submit`, {
      method: "POST",
      token,
    });
  },

  /**
   * 5. Track Application Status by Application ID (GET /nominations/track/:applicationId)
   */
  async trackApplication(applicationId) {
    if (!applicationId) return { success: false, message: "Invalid application ID" };
    return await fetchApi(`/nominations/track/${encodeURIComponent(applicationId)}`, {
      method: "GET",
    });
  },

  /**
   * 6. Get All Nominations (Admin View)
   */
  async getNominations(paramsOrToken = {}, token = null, isAdmin = false) {
    let params = paramsOrToken;
    let authToken = token;
    if (typeof paramsOrToken === "string") {
      authToken = paramsOrToken;
      params = { limit: 10 };
    } else {
      params = { limit: 10, ...params };
    }

    if (isAdmin) {
      const res = await fetchApi("/admin/nominations", {
        method: "GET",
        params,
        token: authToken,
      });
      if (res?.success) return res;
    }
    
    let res = await fetchApi("/applications", {
      method: "GET",
      params,
      token: authToken,
    });
    if (!res?.success) {
      res = await fetchApi("/nominations", {
        method: "GET",
        params,
        token: authToken,
      });
    }
    return res;
  },
};

export default nominationService;
