// Central Base API Client for Government Web Frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

/**
 * Universal Fetch Client with token authorization, FormData handling & error formatting
 */
export async function fetchApi(endpoint, options = {}) {
  const { method = "GET", body = null, token = null, params = null, headers = {} } = options;

  let url = `${API_BASE_URL}${endpoint}`;

  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const isFormData =
    typeof FormData !== "undefined" &&
    (body instanceof FormData || body?.constructor?.name === "FormData");

  const reqHeaders = { ...headers };

  if (isFormData) {
    delete reqHeaders["Content-Type"];
    delete reqHeaders["content-type"];
  } else if (!reqHeaders["Content-Type"] && !reqHeaders["content-type"]) {
    reqHeaders["Content-Type"] = "application/json";
  }

  let rawToken =
    token ||
    (typeof window !== "undefined"
      ? localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("adminToken") ||
        localStorage.getItem("auth_token") ||
        localStorage.getItem("cg_auth_token")
      : null);

  const isValidToken =
    rawToken &&
    typeof rawToken === "string" &&
    rawToken !== "undefined" &&
    rawToken !== "null" &&
    rawToken.trim() !== "";

  if (isValidToken) {
    reqHeaders["Authorization"] = `Bearer ${rawToken.trim()}`;
  }

  const config = {
    method,
    headers: reqHeaders,
    ...(body ? { body: body instanceof FormData ? body : JSON.stringify(body) } : {}),
  };

  try {
    let response;
    try {
      response = await fetch(url, config);
    } catch (primaryErr) {
      const localBase = "http://localhost:5000/api/v1";
      if (API_BASE_URL !== localBase) {
        let localUrl = `${localBase}${endpoint}`;
        if (params && Object.keys(params).length > 0) {
          const query = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              query.append(key, value);
            }
          });
          const queryString = query.toString();
          if (queryString) {
            localUrl += (localUrl.includes("?") ? "&" : "?") + queryString;
          }
        }
        response = await fetch(localUrl, config);
      } else {
        throw primaryErr;
      }
    }
    const contentType = response.headers.get("content-type");
    let data = {};

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        // Clear invalid or expired tokens on 401
        localStorage.removeItem("accessToken");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      return {
        success: false,
        message: data.message || `Authentication failed (${response.status})`,
        errors: data.errors || null,
        status: response.status,
      };
    }

    return {
      success: true,
      message: data.message || "Operation successful",
      data: data.data || data,
    };
  } catch (error) {
    console.warn(`API client error at ${endpoint}:`, error.message);
    return {
      success: false,
      message: error.message || "Network connection error. Please check your backend server.",
    };
  }
}

export default fetchApi;
