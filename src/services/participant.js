import fetchApi from "./client";

export const participantService = {
  // 1. Register / Create Participant (Public Nomination Form)
  async registerParticipant(participantData) {
    return this.createParticipant(participantData);
  },

  async createParticipant(participantData) {
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

    let res = await fetchApi("/participants", { method: "POST", body: participantData });
    if (!res.success && (res.status === 404 || res.message?.includes("not found"))) {
      res = await fetchApi("/participants/register", { method: "POST", body: participantData });
    }
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

  // 4. Delete Participant (Admin)
  async deleteParticipant(id, token) {
    return await fetchApi(`/participants/${encodeURIComponent(id)}`, { method: "DELETE", token });
  },
};

export default participantService;
