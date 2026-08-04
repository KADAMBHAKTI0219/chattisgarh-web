import fetchApi from "./client";

export const votingService = {
  // 1. Cast Public Vote for Application
  async castVote(voteData) {
    return await fetchApi("/voting/cast", { method: "POST", body: voteData });
  },

  // 2. Get Voting Leaderboard & Analytics
  async getAnalytics(params = {}) {
    return await fetchApi("/voting/analytics", { method: "GET", params });
  },
};

export default votingService;
