// API Service layer for backend integration with fallback handling
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Generic fetch wrapper with automatic error handling & JSON parsing
 */
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get("content-type");
    let data = {};

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      return { success: false, message: errorMsg, status: response.status, rawData: data };
    }

    return { success: true, ...data };
  } catch (error) {
    console.warn(`API call to ${endpoint} failed:`, error.message);
    return { success: false, message: error.message || "Network error. Please check your connection." };
  }
}

// ==========================================
// 1. OTP SERVICE
// ==========================================
export const otpService = {
  /**
   * Send 6-digit OTP to mobile number
   * @param {string} phone 
   */
  async sendOtp(phone) {
    return await fetchApi("/otp/send", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  },

  /**
   * Verify OTP entered by user
   * @param {string} phone 
   * @param {string} otp 
   */
  ariaVerifyOtp: async function (phone, otp) {
    return await fetchApi("/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    });
  },
};

// Aliased helper for verification
export const sendOtp = otpService.sendOtp;
export const verifyOtp = otpService.ariaVerifyOtp;

// ==========================================
// 2. CATEGORY SERVICE
// ==========================================
export const categoryService = {
  /**
   * Fetch all categories (optionally filtered by tier or active status)
   * @param {Object} [params] 
   */
  async getCategories(params = {}) {
    const query = new URLSearchParams();
    if (params.isActive !== undefined) query.append("isActive", params.isActive);
    if (params.tier) query.append("tier", params.tier);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return await fetchApi(`/categories${queryString}`, { method: "GET" });
  },

  /**
   * Fetch single category by slug
   * @param {string} slug 
   */
  async getCategoryBySlug(slug) {
    return await fetchApi(`/categories/${encodeURIComponent(slug)}`, { method: "GET" });
  },
};

// ==========================================
// 3. PARTICIPANT / NOMINATION SERVICE
// ==========================================
export const participantService = {
  /**
   * Submit participant nomination form
   * @param {Object} formData 
   */
  async createParticipant(formData) {
    return await fetchApi("/participants", {
      method: "POST",
      body: JSON.stringify(formData),
    });
  },

  /**
   * Fetch participant profile by phone, email, or ID
   * @param {Object} queryParams - { phone, email, id }
   */
  async getParticipantProfile(queryParams = {}) {
    const query = new URLSearchParams(queryParams).toString();
    return await fetchApi(`/participants/profile?${query}`, { method: "GET" });
  },
};

// ==========================================
// 4. AUTH SERVICE (ADMIN)
// ==========================================
export const authService = {
  /**
   * Admin Login
   * @param {string} email 
   * @param {string} password 
   */
  async login(email, password) {
    return await fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
};

// ==========================================
// 5. DASHBOARD SERVICE (ADMIN)
// ==========================================
export const dashboardService = {
  /**
   * Get Admin Stats
   * @param {string} token 
   */
  async getStats(token) {
    return await fetchApi("/dashboard/stats", {
      method: "GET",
      token,
    });
  },
};

export default {
  otp: otpService,
  categories: categoryService,
  participants: participantService,
  auth: authService,
  dashboard: dashboardService,
};
