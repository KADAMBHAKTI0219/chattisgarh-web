// Central Base API Client for Government Web Frontend
const REMOTE_BACKEND_URL = "https://chattisgarh-backend.onrender.com/api/v1";
// const LOCAL_BACKEND_URL = "http://localhost:5000/api/v1";

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
  const { method = "GET", body = null, token = null, params = null, headers = {}, skipToken = false } = options;

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

  // Check if endpoint is a public authentication route
  const isPublicAuthEndpoint =
    skipToken ||
    endpoint.includes("/auth/login") ||
    endpoint.includes("/auth/register") ||
    endpoint.includes("/auth/forgot") ||
    endpoint.includes("/auth/reset");

  let rawToken = null;
  if (!isPublicAuthEndpoint) {
    rawToken =
      token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("accessToken") ||
          localStorage.getItem("token") ||
          localStorage.getItem("adminToken") ||
          localStorage.getItem("auth_token") ||
          localStorage.getItem("cg_auth_token")
        : null);
  }

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

  // Base URLs (Primary Render production backend + Localhost backend fallback when developing)
  const candidateBases = [PRIMARY_API_BASE_URL];
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    if (!candidateBases.includes("http://localhost:5000/api/v1")) {
      candidateBases.push("http://localhost:5000/api/v1");
    }
  }

  let lastResponse = null;
  let lastError = null;

  for (let i = 0; i < candidateBases.length; i++) {
    const currentBase = candidateBases[i];
    const targetUrl = buildUrl(currentBase, endpoint, params);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout || 12000);

      const response = await fetch(targetUrl, {
        ...config,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type");
      let data = {};

      if (contentType && contentType.includes("application/json")) {
        data = await response.json().catch(() => ({}));
      }

      if (response.ok) {
        return {
          success: true,
          message: data.message || "Operation successful",
          total: data.total ?? data.totalCount ?? data.count ?? data.total_records ?? data.totalRecords ?? data.pagination?.total ?? data.meta?.total,
          count: data.count ?? data.total ?? data.totalCount ?? data.pagination?.total ?? data.meta?.total,
          pagination: data.pagination || data.meta || null,
          data: data.data !== undefined ? data.data : data,
          rawResponse: data,
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

      return lastResponse;
    } catch (err) {
      lastError = err;
    }
  }

  return (
    lastResponse || {
      success: false,
      isNetworkError: true,
      message: lastError?.message || "Network connection error. Please check your backend server.",
    }
  );
}

export default fetchApi;

