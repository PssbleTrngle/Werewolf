import { Id } from "models";
import { create } from "zustand";

export interface LocalStore {
  impersonated?: Id | string;
  impersonate(id: Id | string): void;
}

export const useLocalStore = create<LocalStore>((set) => ({
  impersonate(impersonated) {
    set({ impersonated });
  },
}));
