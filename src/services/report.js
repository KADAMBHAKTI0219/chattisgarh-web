import fetchApi from "./client";

export const reportService = {
  // 1. Export All Applications to Excel File (.xlsx)
  async exportApplicationsExcel(token) {
    return await fetchApi("/reports/applications/excel", { method: "GET", token });
  },

  // 2. Export All Applications to CSV File
  async exportApplicationsCSV(token) {
    return await fetchApi("/reports/applications/csv", { method: "GET", token });
  },
};

export default reportService;
