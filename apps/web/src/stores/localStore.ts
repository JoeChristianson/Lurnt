import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocalState {
  welcomeDismissed: boolean;
  dismissWelcome: () => void;
}

export const useLocalStore = create<LocalState>()(
  persist(
    (set) => ({
      welcomeDismissed: false,
      dismissWelcome: () => set({ welcomeDismissed: true }),
    }),
    { name: "erz-local" },
  ),
);
