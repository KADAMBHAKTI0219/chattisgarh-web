import fetchApi from "./client";

export const notificationService = {
  // 1. Get Logged-in User Notifications
  async getUserNotifications(token) {
    if (!token || token === "creator-session-token") {
      return { success: true, data: { notifications: [] } };
    }
    try {
      const res = await fetchApi("/notifications", { method: "GET", token });
      if (res && res.status === 401) {
        return { success: false, data: { notifications: [] } };
      }
      return res;
    } catch (e) {
      return { success: false, data: { notifications: [] } };
    }
  },

  // 2. Mark Notification as Read
  async markRead(id, token) {
    if (!token || token === "creator-session-token" || String(id).startsWith("default-") || String(id).startsWith("broadcast-")) {
      return { success: true, message: "Marked as read" };
    }
    try {
      return await fetchApi(`/notifications/${encodeURIComponent(id)}/read`, { method: "PUT", token });
    } catch (e) {
      return { success: true, message: "Marked as read" };
    }
  },

  // 3. Broadcast Announcement (Admin)
  async broadcastAnnouncement(broadcastData, token) {
    if (!token || token === "creator-session-token") {
      return { success: true, message: "Broadcasted locally", data: broadcastData };
    }
    try {
      return await fetchApi("/notifications/broadcast", { method: "POST", body: broadcastData, token });
    } catch (e) {
      return { success: true, message: "Broadcasted locally", data: broadcastData };
    }
  },
};

export default notificationService;

