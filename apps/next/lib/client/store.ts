import { User } from "models";
import { create } from "zustand";

export interface LocalStore {
  impersonated?: User;
  impersonate(id?: User): void;
}

export const useLocalStore = create<LocalStore>((set) => ({
  impersonate(impersonated) {
    set({ impersonated });
  },
}));
