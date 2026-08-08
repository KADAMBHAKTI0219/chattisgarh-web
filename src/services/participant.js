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
  async getParticipants(params = {}, token) {
    return await fetchApi("/participants", { method: "GET", params, token });
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
