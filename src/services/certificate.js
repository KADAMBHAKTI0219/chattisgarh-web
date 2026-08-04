import fetchApi from "./client";

export const certificateService = {
  // 1. Verify Certificate via QR Hash (Public)
  async verifyCertificate(hash) {
    return await fetchApi("/certificates/verify", { method: "GET", params: { hash } });
  },

  // 2. Get Logged-in Creator Certificates
  async getMyCertificates(token) {
    return await fetchApi("/certificates/my-certificates", { method: "GET", token });
  },

  // 3. Generate Award PDF & QR Certificate (Admin)
  async generateCertificate(certData, token) {
    return await fetchApi("/certificates/generate", { method: "POST", body: certData, token });
  },
};

export default certificateService;
