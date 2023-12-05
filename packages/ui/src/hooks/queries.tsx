import {
  MutationFunction,
  QueryClient,
  QueryFunction,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Event, GameInfo, GameStatus, Id, Player, Role, Vote } from "models";
import { createContext, useContext } from "react";

export interface QueryContext {
  roles: QueryFunction<ReadonlyArray<Role>>;
  gameStatus: QueryFunction<GameStatus>;
  players: QueryFunction<ReadonlyArray<Player>>;
  game: QueryFunction<GameInfo>;
  activeEvent: QueryFunction<Event>;

  submitVote: MutationFunction<unknown, Vote>;
  undo: MutationFunction;
  redo: MutationFunction;
  stop: MutationFunction;
  create: MutationFunction;
}

const NOOP = () => {
  throw new Error("QueryContext missing");
};

const CTX = createContext<QueryContext>({
  roles: NOOP,
  players: NOOP,
  game: NOOP,
  gameStatus: NOOP,
  activeEvent: NOOP,
  submitVote: NOOP,
  undo: NOOP,
  redo: NOOP,
  stop: NOOP,
  create: NOOP,
});

export const GameProvider = CTX.Provider;

export const gameStatusKey = () => ["status"];
export function useGameStatus() {
  const { gameStatus } = useContext(CTX);
  return useSuspenseQuery({ queryKey: gameStatusKey(), queryFn: gameStatus });
}

export const gameInfoKey = (gameId: Id) => ["game", gameId];
export function useGameInfo(gameId: Id) {
  const { game } = useContext(CTX);
  return useSuspenseQuery({
    queryKey: gameInfoKey(gameId),
    queryFn: game,
  });
}

export const activeEventKey = (gameId: Id) => ["game", gameId, "screen"];
export function useActiveEvent(gameId: Id) {
  const { activeEvent } = useContext(CTX);
  return useSuspenseQuery({
    queryKey: activeEventKey(gameId),
    queryFn: activeEvent,
  });
}

export function usePlayers(gameId: Id) {
  const { players } = useContext(CTX);
  return useSuspenseQuery({
    queryKey: ["players", gameId],
    queryFn: players,
  });
}

export const rolesKey = () => ["roles"];
export function useRoles() {
  const { roles } = useContext(CTX);
  return useSuspenseQuery({ queryKey: rolesKey(), queryFn: roles });
}

export function invalidateGameQueries(client: QueryClient) {
  client.invalidateQueries({ queryKey: ["status"] });
  client.invalidateQueries({ queryKey: ["screen"] });
  client.invalidateQueries({ queryKey: ["game"] });
  client.invalidateQueries({ queryKey: ["players"] });
}

export function useInvalidatingMutation<TData, TVariables>(
  mutationFn: MutationFunction<TData, TVariables>
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => invalidateGameQueries(client),
  });
}

export function useVoteMutation() {
  const { submitVote } = useContext(CTX);
  return useInvalidatingMutation(submitVote);
}

export function useUndoMutation() {
  const { undo } = useContext(CTX);
  return useInvalidatingMutation(undo);
}

export function useRedoMutation() {
  const { redo } = useContext(CTX);
  return useInvalidatingMutation(redo);
}

export function useStopMutation() {
  const { stop } = useContext(CTX);
  return useInvalidatingMutation(stop);
}

export function useCreateMutation() {
  const { create } = useContext(CTX);
  return useInvalidatingMutation(create);
}