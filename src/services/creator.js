import fetchApi from "./client";

export const creatorService = {
  // 1. Get Creator Dashboard statistics & applications
  async getDashboard(token) {
    return await fetchApi("/creators/dashboard", { method: "GET", token });
  },

  // 2. Update Creator Social Media handles
  async updateSocialLinks(socialLinks, token) {
    return await fetchApi("/creators/social-links", { method: "PUT", body: { socialLinks }, token });
  },

  // 3. Update Creator Achievements
  async updateAchievements(achievements, token) {
    return await fetchApi("/creators/achievements", { method: "PUT", body: { achievements }, token });
  },

  // 4. Upload Creator Portfolio
  async uploadPortfolio(formDataOrPayload, token) {
    return await fetchApi("/creators/portfolio", { method: "POST", body: formDataOrPayload, token });
  },
};

export default creatorService;
