import { getStoredToken } from "./auth";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getStoredToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await response.json();
  } catch (err) {
    // abaikan jika body kosong
    data = null;
  }

  // JANGAN redirect otomatis, biarkan React Query yang handle
  if (!response.ok) {
    if (response.status === 401) {
  // optional: bisa pakai store untuk logout
      console.warn("401 - Unauthorized");
    }
    throw {
      status: response.status,
      message: data?.message || "Request failed",
      data: data,
    };
  }

  return data;
};
