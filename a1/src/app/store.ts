//
// store.ts — FULL REWRITE (Zustand + Persist)
//

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/api/auth";

const TOKEN_KEY = "access_token";
const USER_KEY = "user";

// Helpers
const saveAuthToStorage = (user: User, token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // actions
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      //
      // SET AUTH (LOGIN)
      //
      setAuth: (user, token) => {
        saveAuthToStorage(user, token);

        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      //
      // LOGOUT
      //
      clearAuth: () => {
        clearAuthStorage();

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      //
      // UPDATE USER (misal saat edit profile)
      //
      updateUser: (user) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        set({ user });
      },
    }),

    {
      name: "auth-storage", // key penyimpanan zustand
      version: 1,

      // cleanup & hydration fix: memastikan storage tidak corrupt
      onRehydrateStorage:
        () =>
        (state) => {
          if (!state) return;

          const token = localStorage.getItem(TOKEN_KEY);
          const userRaw = localStorage.getItem(USER_KEY);

          let user: User | null = null;
          try {
            user = userRaw ? JSON.parse(userRaw) : null;
          } catch {
            user = null;
          }

          state.token = token;
          state.user = user;
          state.isAuthenticated = !!token;
        },
    }
  )
);
