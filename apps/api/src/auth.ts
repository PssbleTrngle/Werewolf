import { ModeratorGameView, PlayerGameView, requirePlayer } from "logic";
import { ApiError, type Id, type User } from "models";
import { GameStatus } from "storage/src/lobbies";
import { ModeratorUser } from "./specialUsers";
import storage from "./storage";

export type Session = {
  user: User;
  impersonated?: Id;
};

export async function createAuthContext(_: Request): Promise<Session> {
  const user = { id: "test-user", name: "Test User" };
  return { user };
}

// TODO move to storage
async function gameIdOf(user: User) {
  const lobby = await storage.lobbies.lobbyOf(user.id);
  if (!lobby || lobby.status === GameStatus.NONE) return null;
  return lobby.id;
}

function isAdmin(_: User) {
  return true;
}

export async function sessionView(
  { impersonated, user }: Session,
  gameId?: Id,
) {
  const realGameId = gameId ?? (await gameIdOf(user));
  if (!realGameId) return null;

  const game = await storage.games.getGame(realGameId);
  const admin = isAdmin(user);

  if (isAdmin(user) && impersonated) {
    if (impersonated === ModeratorUser.id) {
      return new ModeratorGameView(game);
    } else {
      game.requirePlayer(impersonated);
      return new PlayerGameView(game, impersonated);
    }
  }

  if (!requirePlayer(game.players, user.id) && !admin) {
    throw new ApiError(403, "You are not part of this game");
  }

  return new PlayerGameView(game, user.id);
}

export async function requireSessionView(session: Session, gameId?: Id) {
  const view = await sessionView(session, gameId);
  if (view) return view;
  throw new ApiError(403, "not part of a game");
}
