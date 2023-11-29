import {
  MutationFunction,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Event, GameStatus, Player, Role, Vote } from "models";
import { createContext, useContext } from "react";

export interface GameContext {
  roles(): Promise<ReadonlyArray<Role>>;
  players(): Promise<ReadonlyArray<Player>>;
  game(): Promise<GameStatus | null>;
  activeEvent(): Promise<Event<unknown>>;
  submitVote(vote: Vote): Promise<void>;
  undo(): Promise<void>;
  redo(): Promise<void>;
  stop(): Promise<void>;
  create(): Promise<void>;
}

const NOOP = () => {
  throw new Error("GameContext missing");
};

const GameContext = createContext<GameContext>({
  roles: NOOP,
  players: NOOP,
  game: NOOP,
  activeEvent: NOOP,
  submitVote: NOOP,
  undo: NOOP,
  redo: NOOP,
  stop: NOOP,
  create: NOOP,
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

export function usePlayers() {
  const { players } = useContext(GameContext);
  return useQuery({ queryKey: ["players"], queryFn: players });
}

export function useRoles() {
  const { roles } = useContext(GameContext);
  return useQuery({ queryKey: ["roles"], queryFn: roles });
}

export function invalidateGameQueries(client: QueryClient) {
  client.invalidateQueries({ queryKey: ["screen"] });
  client.invalidateQueries({ queryKey: ["game"] });
  client.invalidateQueries({ queryKey: ["players"] });
}

function useInvalidatingMutation<TData, TVariables>(
  mutationFn: MutationFunction<TData, TVariables>
) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["vote"],
    mutationFn,
    onSuccess: () => invalidateGameQueries(client),
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

export function useStopMutation() {
  const { stop } = useContext(GameContext);
  return useInvalidatingMutation(stop);
}

export function useCreateMutation() {
  const { create } = useContext(GameContext);
  return useInvalidatingMutation(create);
}
