"use client";

import { API_BASE_URL } from "./config";

type ApiOptions = RequestInit & {
  json?: boolean;
  silent?: boolean; // If true, won't throw errors for 401/403 - useful for auth checks
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  // Ensure path starts with /api for backend routes
  const normalizedPath = path.startsWith("/api") ? path : `/api${path}`;
  const url = `${API_BASE_URL}${normalizedPath}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  // Always include credentials for authenticated requests
  // Extract credentials and headers from options to prevent override
  const { credentials: _, headers: __, ...restOptions } = options;
  
  // CRITICAL: credentials: "include" is REQUIRED for cookies to work
  // This ensures cookies are sent with requests AND Set-Cookie headers are accepted
  const fetchOptions: RequestInit = {
    ...restOptions,
    credentials: "include", // CRITICAL: Always include cookies
    headers,
  };
  
  try {
    const response = await fetch(url, fetchOptions);

    const isJson =
      options.json ?? response.headers.get("content-type")?.includes("application/json");

    let payload: any;
    try {
      payload = isJson ? await response.json() : await response.text();
    } catch (parseError) {
      // If JSON parsing fails, handle gracefully
      if (options.silent) {
        return null as T;
      }
      throw new ApiError("Invalid response from server", response.status);
    }

    if (!response.ok) {
      const message = isJson
        ? payload?.message ?? "Đã xảy ra lỗi"
        : (payload as string);
      
      // If silent mode is enabled and it's a 401/403, return null instead of throwing
      if (options.silent && (response.status === 401 || response.status === 403)) {
        return null as T;
      }
      
      throw new ApiError(message, response.status);
    }

    return payload as T;
  } catch (error) {
    // Handle network errors (connection refused, timeout, etc.)
    // Check for various network error patterns
    const isNetworkError = 
      error instanceof TypeError && 
      (error.message.includes("fetch") || 
       error.message.includes("Failed to fetch") ||
       error.message.includes("NetworkError") ||
       error.message.includes("ERR_CONNECTION_REFUSED") ||
       error.message.includes("ERR_NETWORK"));
    
    if (isNetworkError) {
      const networkError = new ApiError(
        "Không thể kết nối đến server. Vui lòng thử lại sau.",
        0
      );
      networkError.name = "NetworkError";
      
      // Only log network errors if not in silent mode
      if (!options.silent) {
        console.error(`[apiFetch] Network error for ${url}:`, error);
      }
      
      // In silent mode, return null for network errors too
      if (options.silent) {
        return null as T;
      }
      
      throw networkError;
    }
    
    // Re-throw ApiError and other known errors
    throw error;
  }
}




