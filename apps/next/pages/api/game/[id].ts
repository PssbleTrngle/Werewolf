import { GameInfo } from "models";
import { ApiError } from "next/dist/server/api-utils";
import { createApiHandler, methods } from "../../../lib/server/apiHandlers";
import { deleteLobby, getLobby, startGame } from "../../../lib/server/games";
import {
  requireServerSession,
  requireSessionView,
} from "../../../lib/server/session";

const GET = createApiHandler<GameInfo>(async (req, res) => {
  // TODO validate & use
  const { id } = req.query;

  const view = await requireSessionView({ req, res });

  res.status(200).json(view.gameInfo());
});

const POST = createApiHandler(async (req, res) => {
  const session = await requireServerSession({ req, res });
  // TODO validate
  const { id } = req.query;

  const lobby = await getLobby(id as string);

  if (lobby.owner.id !== session.user.id) {
    throw new ApiError(403, "you are not the owner of this lobby");
  }

  const game = await startGame(lobby);

  await deleteLobby(lobby);

  res.status(200).json({ gameId: game.id });
});

export default methods({ GET, POST });
