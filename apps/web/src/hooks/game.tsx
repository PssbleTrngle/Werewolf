import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Event, Vote } from "models";
import { createContext, useContext } from "react";

export interface GameContext {
  activeEvent(): Promise<Event>;
  submitVote(vote: Vote): Promise<void>;
}

const NOOP = () => {
  throw new Error("GameContext missing");
};

const GameContext = createContext<GameContext>({
  activeEvent: NOOP,
  submitVote: NOOP,
});

export const GameProvider = GameContext.Provider;

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
    },
  });
}
