import type { MutationFunction } from "@tanstack/react-query";
import { inGroup } from "logic";
import { Villager } from "logic/src/game/role/villager";
import { Werewolf } from "logic/src/game/role/wolf";
import { createKillEvent } from "logic/src/game/role/wolf/events";
import { RoleGroup, type GameInfo, type Player } from "models";
import { useMemo, type PropsWithChildren } from "react";
import { GameProvider, type QueryContext } from "ui";

const NOOP: MutationFunction = async () => {};

function useFakeGame(): QueryContext {
  return useMemo(() => {
    const game: GameInfo = {
      day: 1,
      time: "night",
    };

    const players: Player[] = [
      { id: "a", name: "Alex", role: Villager },
      { id: "b", name: "Bob", role: Villager },
      { id: "c", name: "Chloe", role: Werewolf },
      { id: "d", name: "Dan", role: Werewolf },
      { id: "e", name: "Eve", role: Villager },
      { id: "f", name: "Finn", role: Villager },
      { id: "g", name: "Gary", role: Werewolf },
      { id: "h", name: "Hanna", role: Villager },
    ];

    const event = createKillEvent(
      players.filter(inGroup(RoleGroup.WOLF)),
      players.filter(inGroup(RoleGroup.VILLAGER)),
      1,
    );

    return {
      activeEvent: async () => event,
      game: async () => game,
      players: async () => players,
      roles: async () => [],
      create: NOOP,
      stop: NOOP,
      redo: NOOP,
      undo: NOOP,
      submitVote: NOOP,
    };
  }, []);
}

export default function FakeGame({ children }: PropsWithChildren) {
  const context = useFakeGame();
  return <GameProvider value={context}>{children}</GameProvider>;
}
