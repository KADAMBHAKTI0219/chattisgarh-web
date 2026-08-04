import fetchApi from "./client";

export const otpService = {
  // 1. Send SMS OTP to Mobile Number
  async sendOtp(phone) {
    return await fetchApi("/otp/send", { method: "POST", body: { phone } });
  },

  // 2. Verify SMS OTP
  async verifyOtp(phone, otp) {
    return await fetchApi("/otp/verify", { method: "POST", body: { phone, otp } });
  },
};

export default otpService;
