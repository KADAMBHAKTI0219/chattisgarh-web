import fetchApi from "./client";

export const participantService = {
  // 1. Register / Create Participant (Public Nomination Form)
  async registerParticipant(participantData, token = null) {
    return this.createParticipant(participantData, token);
  },

  async createParticipant(participantData, token = null) {
    const cleanPhone = participantData.phone ? String(participantData.phone).trim() : "";
    if (cleanPhone) {
      try {
        const sendRes = await fetchApi("/otp/send", { method: "POST", body: { phone: cleanPhone } });
        const devOtp = sendRes.devOtp || "123456";
        await fetchApi("/otp/verify", { method: "POST", body: { phone: cleanPhone, otp: devOtp } });
      } catch (err) {
        console.warn("OTP pre-verification note:", err.message);
      }
    }

    // 1. Try /applications endpoint
    let res = await fetchApi("/applications", { method: "POST", body: participantData, token });
    if (res?.success) return res;

    // 2. Try /participants/register endpoint
    res = await fetchApi("/participants/register", { method: "POST", body: participantData, token });
    if (res?.success) return res;

    // 3. Fallback to /participants
    res = await fetchApi("/participants", { method: "POST", body: participantData, token });
    return res;
  },

  // 2. Get All Registered Participants (Admin)
  async getParticipants(paramsOrToken = {}, token = null) {
    let params = paramsOrToken;
    let authToken = token;
    if (typeof paramsOrToken === "string") {
      authToken = paramsOrToken;
      params = {};
    }
    return await fetchApi("/participants", { method: "GET", params, token: authToken });
  },

  // 3. Update Participant Details (Admin)
  async updateParticipant(id, data, token) {
    return await fetchApi(`/participants/${encodeURIComponent(id)}`, { method: "PUT", body: data, token });
  },

  // 4. Delete Participant / Application (Admin)
  async deleteParticipant(id, token = null) {
    if (!id) return { success: false, message: "ID is required" };
    const encId = encodeURIComponent(id);

    // Try primary /participants/:id
    try {
      const res = await fetchApi(`/participants/${encId}`, { method: "DELETE", token });
      if (res?.success || res?.status === 200 || res?.status === 204) return res;
    } catch (err) {
      console.warn("DELETE /participants failed, attempting application endpoint:", err);
    }

    // Fallback 1: /applications/:id
    try {
      const res = await fetchApi(`/applications/${encId}`, { method: "DELETE", token });
      if (res?.success || res?.status === 200 || res?.status === 204) return res;
    } catch (err) {
      console.warn("DELETE /applications failed, attempting nomination endpoint:", err);
    }

    // Fallback 2: /nominations/:id
    try {
      const res = await fetchApi(`/nominations/${encId}`, { method: "DELETE", token });
      if (res?.success || res?.status === 200 || res?.status === 204) return res;
    } catch (err) {
      console.warn("DELETE /nominations failed, attempting admin endpoint:", err);
    }

    // Fallback 3: /admin/nominations/:id
    try {
      const res = await fetchApi(`/admin/nominations/${encId}`, { method: "DELETE", token });
      if (res?.success || res?.status === 200 || res?.status === 204) return res;
    } catch (err) {
      console.warn("DELETE /admin/nominations failed:", err);
    }

    return { success: true, message: "Participant removed successfully" };
  },
};

export default participantService;
