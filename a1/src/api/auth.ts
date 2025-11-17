//
// auth.ts — FULL REWRITE
//

export type Role = "admin" | "kepala_gudang" | "retriever";

export interface User {
  id_user: string;
  username: string;
  email?: string;
  role: Role;
  nama_lengkap?: string;
}

export interface LoginRequest {
  identifier: string; // username atau email
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
  redirect_url?: string;
}

const API_BASE_URL = "http://127.0.0.1:8000/api";

//
// LOGIN API
//
export const loginAPI = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      throw new Error("Gagal membaca response dari server.");
    }

    if (!response.ok) {
      throw new Error(data?.message || "Login gagal.");
    }

    return data as LoginResponse;
  } catch (err: any) {
    throw new Error(err.message || "Kesalahan jaringan.");
  }
};

//
// STORAGE HANDLER
//

const TOKEN_KEY = "access_token";
const USER_KEY = "user";

// simpan token & user
export const storeAuth = (response: LoginResponse) => {
  localStorage.setItem(TOKEN_KEY, response.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(response.user));
};

// hapus auth (logout)
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ambil token dari storage
export const getStoredToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token || null;
};

// ambil user dari storage
export const getStoredUser = (): User | null => {
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;

  try {
    return JSON.parse(user) as User;
  } catch {
    return null;
  }
};

// status login
export const isAuthenticated = (): boolean => {
  return !!getStoredToken();
};

//
// authApi wrapper
//
export const authApi = {
  login: loginAPI,
};
