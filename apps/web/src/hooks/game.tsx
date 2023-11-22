import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Event, GameStatus, Vote } from "models";
import { createContext, useContext } from "react";

export interface GameContext {
  game(): Promise<GameStatus>;
  activeEvent(): Promise<Event>;
  submitVote(vote: Vote): Promise<void>;
}

const NOOP = () => {
  throw new Error("GameContext missing");
};

const GameContext = createContext<GameContext>({
  game: NOOP,
  activeEvent: NOOP,
  submitVote: NOOP,
});

export const GameProvider = GameContext.Provider;

export function useGameStatus() {
  const { game } = useContext(GameContext);
  return useQuery({ queryKey: ["game"], queryFn: game });
}

export function useActiveEvent() {
  const { activeEvent } = useContext(GameContext);
  return useQuery({ queryKey: ["screen"], queryFn: activeEvent });
}

export function useVoteMutation() {
  const client = useQueryClient();
  const { submitVote } = useContext(GameContext);
  return useMutation({
    mutationKey: ["vote"],
    mutationFn: submitVote,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["screen"] });
      client.invalidateQueries({ queryKey: ["game"] });
    },
  });
}
