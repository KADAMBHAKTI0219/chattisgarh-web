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

  const reqHeaders = { ...headers };

  if (!(body instanceof FormData)) {
    reqHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    reqHeaders["Authorization"] = `Bearer ${token}`;
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
      return {
        success: false,
        message: data.message || `Request failed with status ${response.status}`,
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
