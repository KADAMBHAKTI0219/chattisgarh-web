import fetchApi from "./client";

export const dashboardService = {
  // 1. Get Admin System Overview Metrics
  async getAdminDashboard(token) {
    return await fetchApi("/dashboard/admin", { method: "GET", token });
  },

  // 2. Get Jury Dashboard Overview Metrics
  async getJuryDashboard(token) {
    return await fetchApi("/dashboard/jury", { method: "GET", token });
  },

  // 3. Get Stats (/dashboard/stats)
  async getStats(token) {
    return await fetchApi("/dashboard/stats", { method: "GET", token });
  },

  // 4. Get Summary (/dashboard/summary)
  async getSummary(token) {
    return await fetchApi("/dashboard/summary", { method: "GET", token });
  },

  // 5. Get Overview (/dashboard/overview)
  async getOverview(token) {
    return await fetchApi("/dashboard/overview", { method: "GET", token });
  }
};

export default dashboardService;

