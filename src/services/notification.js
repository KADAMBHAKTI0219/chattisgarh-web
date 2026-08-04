import fetchApi from "./client";

export const notificationService = {
  // 1. Get Logged-in User Notifications
  async getUserNotifications(token) {
    return await fetchApi("/notifications", { method: "GET", token });
  },

  // 2. Mark Notification as Read
  async markRead(id, token) {
    return await fetchApi(`/notifications/${encodeURIComponent(id)}/read`, { method: "PUT", token });
  },

  // 3. Broadcast Announcement (Admin)
  async broadcastAnnouncement(broadcastData, token) {
    return await fetchApi("/notifications/broadcast", { method: "POST", body: broadcastData, token });
  },
};

export default notificationService;
