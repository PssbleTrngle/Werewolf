import {
  MutationFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Event, GameStatus, Vote } from "models";
import { createContext, useContext } from "react";

export interface GameContext {
  game(): Promise<GameStatus>;
  activeEvent(): Promise<Event>;
  submitVote(vote: Vote): Promise<void>;
  undo(): Promise<void>;
  redo(): Promise<void>;
}

const NOOP = () => {
  throw new Error("GameContext missing");
};

const GameContext = createContext<GameContext>({
  game: NOOP,
  activeEvent: NOOP,
  submitVote: NOOP,
  undo: NOOP,
  redo: NOOP,
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

function useInvalidatingMutation<TData, TVariables>(
  mutationFn: MutationFunction<TData, TVariables>,
) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["vote"],
    mutationFn,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["screen"] });
      client.invalidateQueries({ queryKey: ["game"] });
    },
  });
}

export function useVoteMutation() {
  const { submitVote } = useContext(GameContext);
  return useInvalidatingMutation(submitVote);
}

export function useUndoMutation() {
  const { undo } = useContext(GameContext);
  return useInvalidatingMutation(undo);
}

export function useRedoMutation() {
  const { redo } = useContext(GameContext);
  return useInvalidatingMutation(redo);
}
