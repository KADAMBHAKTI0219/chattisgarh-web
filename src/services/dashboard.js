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
};

export default dashboardService;
