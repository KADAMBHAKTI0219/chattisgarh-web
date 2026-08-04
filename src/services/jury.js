import fetchApi from "./client";

export const juryService = {
  // 1. Assign Jury Member to Application (Admin)
  async assignJury(data, token) {
    return await fetchApi("/jury/assign", { method: "POST", body: data, token });
  },

  // 2. Get Assigned Applications for Logged-in Jury
  async getAssignedApplications(token) {
    return await fetchApi("/jury/assigned", { method: "GET", token });
  },

  // 3. Submit Jury Evaluation Scores for Application
  async scoreApplication(applicationId, scoreData, token) {
    return await fetchApi(`/jury/score/${encodeURIComponent(applicationId)}`, { method: "POST", body: scoreData, token });
  },

  // 4. Get Jury Scores Leaderboard
  async getLeaderboard(params = {}, token) {
    return await fetchApi("/jury/leaderboard", { method: "GET", params, token });
  },
};

export default juryService;
