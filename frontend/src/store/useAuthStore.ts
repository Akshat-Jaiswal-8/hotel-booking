import { create } from "zustand";
import Cookies from "js-cookie";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => {
        set({ user: user });
      },
      logout: () => {
        Cookies.remove("token");
        localStorage.removeItem("auth-storage");
        set({ user: null });
        window.location.reload();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
