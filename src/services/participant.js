import fetchApi from "./client";

export const participantService = {
  // 1. Register / Create Participant (Public Nomination Form)
  async registerParticipant(participantData) {
    return await fetchApi("/participants/register", { method: "POST", body: participantData });
  },

  async createParticipant(participantData) {
    return await fetchApi("/participants/register", { method: "POST", body: participantData });
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
