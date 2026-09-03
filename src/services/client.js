// Central Base API Client for Government Web Frontend
const REMOTE_BACKEND_URL = "https://government-web-backend.onrender.com/api/v1";
const LOCAL_BACKEND_URL = "http://localhost:5000/api/v1";

function resolveApiBaseUrl() {
  let envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl || envUrl.trim() === "") {
    return REMOTE_BACKEND_URL;
  }
  let trimmed = envUrl.trim().replace(/\/+$/, "");
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    if (!trimmed.startsWith("/")) {
      trimmed = "/" + trimmed;
    }
  }
  return trimmed;
}

const PRIMARY_API_BASE_URL = resolveApiBaseUrl();

function buildUrl(baseUrl, endpoint, params) {
  let base = baseUrl.replace(/\/+$/, "");
  let ep = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  let fullUrl = `${base}${ep}`;

  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    if (queryString) {
      fullUrl += (fullUrl.includes("?") ? "&" : "?") + queryString;
    }
  }
  return fullUrl;
}

/**
 * Universal Fetch Client with token authorization, FormData handling, 404 fallback & error formatting
 */
export async function fetchApi(endpoint, options = {}) {
  const { method = "GET", body = null, token = null, params = null, headers = {} } = options;

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

  const candidateBases = [PRIMARY_API_BASE_URL];
  if (!candidateBases.includes(REMOTE_BACKEND_URL)) {
    candidateBases.push(REMOTE_BACKEND_URL);
  }
  if (!candidateBases.includes(LOCAL_BACKEND_URL)) {
    candidateBases.push(LOCAL_BACKEND_URL);
  }

  let lastResponse = null;
  let lastError = null;

  for (let i = 0; i < candidateBases.length; i++) {
    const currentBase = candidateBases[i];
    const targetUrl = buildUrl(currentBase, endpoint, params);

    try {
      const response = await fetch(targetUrl, config);
      const contentType = response.headers.get("content-type");
      let data = {};

      if (contentType && contentType.includes("application/json")) {
        data = await response.json().catch(() => ({}));
      }

      if (response.ok) {
        return {
          success: true,
          message: data.message || "Operation successful",
          data: data.data !== undefined ? data.data : data,
        };
      }

      lastResponse = {
        success: false,
        message: data.message || `Request failed with status ${response.status}`,
        errors: data.errors || null,
        status: response.status,
      };

      if (response.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return lastResponse;
      }

      // If status 404 occurs on relative/local route, attempt next candidate base URL
      if (response.status === 404 && i < candidateBases.length - 1) {
        console.warn(`404 at ${targetUrl}, trying fallback base ${candidateBases[i + 1]}`);
        continue;
      }

      return lastResponse;
    } catch (err) {
      lastError = err;
      console.warn(`Network connection error attempting ${targetUrl}:`, err.message);
    }
  }

  return (
    lastResponse || {
      success: false,
      message: lastError?.message || "Network connection error. Please check your backend server.",
    }
  );
}

export default fetchApi;

