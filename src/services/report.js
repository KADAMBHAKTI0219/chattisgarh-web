import fetchApi from "./client";

const REMOTE_BACKEND_URL = "https://chattisgarh-backend.onrender.com/api/v1";

function getApiBaseUrl() {
  let envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl || envUrl.trim() === "") {
    return REMOTE_BACKEND_URL;
  }
  return envUrl.trim().replace(/\/+$/, "");
}

// Download spreadsheet or CSV directly from backend
async function downloadReportFile(endpoint, filename, token) {
  try {
    const baseUrl = getApiBaseUrl();
    const targetUrl = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    
    let rawToken =
      token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("accessToken") ||
          localStorage.getItem("token") ||
          localStorage.getItem("adminToken") ||
          localStorage.getItem("auth_token") ||
          localStorage.getItem("cg_auth_token")
        : null);

    const headers = {};
    if (rawToken && rawToken !== "null" && rawToken !== "undefined") {
      headers["Authorization"] = `Bearer ${rawToken.trim()}`;
    }

    const response = await fetch(targetUrl, { method: "GET", headers });
    if (!response.ok) {
      throw new Error(`Failed to download report: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return { success: true, message: `${filename} downloaded successfully` };
  } catch (err) {
    console.error("Report download error:", err);
    return { success: false, message: err.message || "Failed to download report file" };
  }
}

export const reportService = {
  // 1. Analytics & Overview JSON Endpoints
  async getAnalytics(token) {
    return await fetchApi("/reports/analytics", { method: "GET", token });
  },
  async getOverview(token) {
    return await fetchApi("/reports/overview", { method: "GET", token });
  },
  async getSummary(token) {
    return await fetchApi("/reports/summary", { method: "GET", token });
  },

  // 2. Spreadsheet & CSV Export Endpoints
  // Participants Export
  async exportParticipantsExcel(token) {
    return await downloadReportFile("/reports/participants/excel", "Participants_Report.xlsx", token);
  },
  async exportParticipantsCSV(token) {
    return await downloadReportFile("/reports/participants/csv", "Participants_Report.csv", token);
  },

  // Applications Export
  async exportApplicationsExcel(token) {
    return await downloadReportFile("/reports/applications/excel", "Applications_Report.xlsx", token);
  },
  async exportApplicationsCSV(token) {
    return await downloadReportFile("/reports/applications/csv", "Applications_Report.csv", token);
  },

  // Users Export
  async exportUsersExcel(token) {
    return await downloadReportFile("/reports/users/excel", "Users_Report.xlsx", token);
  },
  async exportUsersCSV(token) {
    return await downloadReportFile("/reports/users/csv", "Users_Report.csv", token);
  }
};

export default reportService;


