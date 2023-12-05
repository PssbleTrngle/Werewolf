"use client";

import {
  QueryFunction,
  QueryKey,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Id } from "models";
import { useMemo } from "react";
import { QueryContext, gameStatusKey } from "ui";
import type { Lobby } from "../server/games";

interface ApiError {
  message?: string;
}

class FetchError extends Error {
  constructor(
    public readonly status: number,
    message?: string
  ) {
    super(message);
  }
}

const isServer = typeof window === "undefined";

async function request<T, D>(endpoint: string, method = "GET", data?: D) {
  const url = `/api/${endpoint}`;

  if (isServer) {
    throw new Error(
      `Cannot fetch API server-side, missing prefetched query for '${url}'`
    );
  }

  const body = data && JSON.stringify(data);

  const response = await fetch(url, {
    body,
    method,
    headers: {
      "Content-Type": "application/json",
      Accepts: "application/json",
    },
  });

  if (response.status === 204) {
    return null as T;
  }

  const json = await response.json();

  if (response.ok) {
    return json as T;
  } else {
    const error = json as ApiError;
    throw new FetchError(response.status, error.message ?? response.statusText);
  }
}

function createFetcher<R>(endpoint: string, method = "GET") {
  return () => request<R, never>(endpoint, method);
}

function createAwareFetcher<R>(
  endpoint: (key: QueryKey) => string,
  method = "GET"
): QueryFunction<R> {
  return ({ queryKey }) => request<R, never>(endpoint(queryKey), method);
}

function createMutator<R, D>(endpoint: string, method: string) {
  return (data?: D) => request<R, D>(endpoint, method, data);
}

export default function createRemoteContext(): QueryContext {
  return {
    roles: createFetcher("roles"),
    // TODO game id in path
    players: createFetcher("game/players"),
    game: createFetcher("game"),
    gameStatus: createFetcher("game/status"),
    activeEvent: createFetcher("game/event/active"),

    submitVote: createMutator("game/vote", "POST"),
    undo: createMutator("game/undo", "POST"),
    redo: createMutator("game/redo", "POST"),
    stop: createMutator("game", "DELETE"),
    create: createMutator("lobby", "POST"),
  };
}

const fetchLobbies = createFetcher<Lobby[]>("lobby");
export const lobbiesKey = () => ["lobbies"];
export function useLobbies() {
  return useSuspenseQuery({
    queryKey: lobbiesKey(),
    queryFn: fetchLobbies,
  });
}

const fetchLobby = createAwareFetcher<Lobby>(([, id]) => `lobby/${id}`);
export const lobbyKey = (id: Id) => ["lobby", id];
export function useLobby(id: Id) {
  return useSuspenseQuery({
    queryKey: lobbyKey(id),
    queryFn: fetchLobby,
  });
}

export function useJoinMutation(lobbyId: Id) {
  const client = useQueryClient();

  const submit = useMemo(
    () => createMutator(`lobby/${lobbyId}/player`, "POST"),
    [lobbyId]
  );

  return useMutation({
    mutationFn: () => submit(),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: gameStatusKey() });
      client.invalidateQueries({ queryKey: lobbiesKey() });
    },
  });
}

export function useLeaveMutation(lobbyId: Id) {
  const client = useQueryClient();

  const submit = useMemo(
    () => createMutator(`lobby/${lobbyId}/player`, "DELETE"),
    [lobbyId]
  );

  return useMutation({
    mutationFn: () => submit(),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: gameStatusKey() });
      client.invalidateQueries({ queryKey: lobbiesKey() });
    },
  });
}

export function useStartMutation(lobbyId: Id) {
  const client = useQueryClient();

  const submit = useMemo(
    () => createMutator(`game/${lobbyId}`, "POST"),
    [lobbyId]
  );

  return useMutation({
    mutationFn: () => submit(),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: gameStatusKey() });
      client.invalidateQueries({ queryKey: lobbiesKey() });
    },
  });
}
