import { GameStatus, Id } from "models";
import connectRedis from "./redis.js";

export async function statusOf(playerId: Id): Promise<GameStatus> {
  const redis = await connectRedis();

  const [lobbyId, gameId] = await Promise.all([
    redis.get(`player:${playerId}:lobby`),
    redis.get(`player:${playerId}:game`),
  ]);

  if (gameId) {
    return {
      type: "game",
      id: gameId,
    };
  }

  if (lobbyId) {
    return {
      type: "lobby",
      id: lobbyId,
    };
  }

  return {
    type: "none",
  };
}
