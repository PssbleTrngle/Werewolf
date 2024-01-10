import { GameState, generateRoles } from "logic";
import { GameSettings, Id, Player, defaultGameSettings } from "models";
import { nanoid } from "nanoid";
import { create, type StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PlayerValues = Omit<Player, "id">;

export interface GameStore {
  history: ReadonlyArray<GameState> | null;
  save(history: ReadonlyArray<GameState> | null): void;
}

export interface PlayerStore {
  players: ReadonlyArray<Player>;
  addPlayer(player: PlayerValues): void;
  removePlayer(id: Id): void;
  modifyPlayer(id: Id, values: Partial<PlayerValues>): void;
  randomizeRoles(): void;
}

export interface SettingsStore extends GameSettings {
  toggleRole(key: string, enabled: boolean): void;
  modifySettings(values: Partial<GameSettings>): void;
  resetSettings(): void;
}

export type LocalStore = PlayerStore & GameStore & SettingsStore;

const createGameStore: StateCreator<GameStore> = (set) => ({
  history: null,
  save(history) {
    set({ history });
  },
});

const createPlayerStore: StateCreator<PlayerStore & GameSettings> = (
  set,
  get,
) => ({
  ...defaultGameSettings,

  players: [],

  addPlayer(values) {
    const player: Player = { ...values, id: nanoid() };
    set({ players: [...get().players, player] });
  },

  removePlayer(id) {
    set({ players: get().players.filter((it) => it.id !== id) });
  },

  modifyPlayer(id, values) {
    set({
      players: get().players.map((it) => {
        if (it.id === id) return { ...it, ...values };
        return it;
      }),
    });
  },

  randomizeRoles() {
    const { players, ...settings } = get();
    set({ players: generateRoles(players, settings) });
  },
});

const createSettingsStore: StateCreator<SettingsStore> = (set, get) => ({
  ...defaultGameSettings,

  toggleRole(key, enabled) {
    const disabledRoles = [...(get().disabledRoles ?? [])];

    const currentlyDisabled = disabledRoles?.includes(key);
    if (currentlyDisabled !== enabled) return;

    if (enabled) disabledRoles.splice(disabledRoles.indexOf(key), 1);
    else disabledRoles.push(key);

    set({ disabledRoles });
  },

  modifySettings(values) {
    set(values);
  },

  resetSettings() {
    const defaultValues: Partial<GameSettings> = { ...defaultGameSettings };
    delete defaultValues.disabledRoles;
    set(defaultValues);
  },
});

export const useLocalStore = create(
  persist<LocalStore>(
    (...args) => ({
      ...createGameStore(...args),
      ...createPlayerStore(...args),
      ...createSettingsStore(...args),
    }),
    {
      name: "werewolf",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
