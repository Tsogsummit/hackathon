import { create } from "zustand";
import { persist } from "zustand/middleware";

import { apiFetch } from "../api/client.js";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
      login: async (email, password) => {
        const data = await apiFetch("/auth/login", {
          method: "POST",
          body: { email, password },
        });
        set({ token: data.access_token });
        const me = await apiFetch("/auth/me", { token: data.access_token });
        set({ user: me });
        return me;
      },
      refreshMe: async () => {
        const { token } = get();
        if (!token) return null;
        const me = await apiFetch("/auth/me", { token });
        set({ user: me });
        return me;
      },
    }),
    {
      name: "stuto-auth",
      partialize: (s) => ({ token: s.token }),
    }
  )
);
