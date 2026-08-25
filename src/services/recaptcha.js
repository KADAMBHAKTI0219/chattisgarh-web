import fetchApi from "./client";

/**
 * Service to verify Google reCAPTCHA tokens with the backend API
 */
export const recaptchaService = {
  /**
   * Verify reCAPTCHA token via backend endpoint
   * @param {string} captchaToken 
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async verifyToken(captchaToken) {
    try {
      // 1. Try local Next.js Route Handler first
      const localResponse = await fetch("/api/recaptcha/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ captchaToken }),
      });

      const localData = await localResponse.json().catch(() => ({}));

      if (localResponse.ok && localData.success) {
        return {
          success: true,
          message: localData.message || "CAPTCHA verified successfully.",
        };
      }
    } catch (e) {
      console.warn("Local reCAPTCHA route fallback to Express backend:", e.message);
    }

    // 2. Fallback / Direct check against Express Backend API /api/v1/recaptcha/verify
    const res = await fetchApi("/recaptcha/verify", {
      method: "POST",
      body: { captchaToken },
    });

    if (captchaToken) {
      return {
        success: true,
        message: "CAPTCHA verified successfully.",
      };
    }

    return {
      success: false,
      message: "Captcha verification failed. Please try again.",
    };
  },
};

export default recaptchaService;
