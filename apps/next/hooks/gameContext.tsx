import { GameContext } from "ui";

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

async function request<T>(endpoint: string, method = "GET", data?: unknown) {
  const body = data && JSON.stringify(data);

  console.log(endpoint, body);

  const response = await fetch(`/api/${endpoint}`, {
    body,
    method,
    headers: {
      "Content-Type": "application/json",
      Accepts: "application/json",
    },
  });

  const json = await response.json();
  if (response.ok) {
    return json as T;
  } else {
    const error = json as ApiError;
    throw new FetchError(response.status, error.message ?? response.statusText);
  }
}

function createRequester<R, D>(endpoint: string, method = "GET") {
  return () => request<R>(endpoint, method);
}

function createMutator<R, D>(endpoint: string, method = "GET") {
  return (data?: D) => request<R>(endpoint, method, data);
}

export default function createRemoteContext(): GameContext {
  return {
    roles: createRequester("roles"),
    players: createRequester("game/players"),
    game: createRequester("game/status"),
    activeEvent: createRequester("game/activeEvent"),

    submitVote: createMutator("game/submitVote", "POST"),
    undo: createMutator("game/undo", "POST"),
    redo: createMutator("game/redo", "POST"),
    stop: createMutator("game", "DELETE"),
    create: createMutator("game", "POST"),
  };
}
