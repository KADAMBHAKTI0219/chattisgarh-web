import fetchApi from "./client";

export const participantService = {
  // 1. Register Participant (Public Nomination Form)
  async registerParticipant(participantData) {
    return await fetchApi("/participants/register", { method: "POST", body: participantData });
  },

  // 2. Get All Registered Participants (Admin)
  async getParticipants(params = {}, token) {
    return await fetchApi("/participants", { method: "GET", params, token });
  },
};

export default participantService;
