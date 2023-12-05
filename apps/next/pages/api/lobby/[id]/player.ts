import { createApiHandler, methods } from "../../../../lib/server/apiHandlers";
import { joinLobby, leaveLobby } from "../../../../lib/server/games";
import { requireServerSession } from "../../../../lib/server/session";

const POST = createApiHandler(async (req, res) => {
  const session = await requireServerSession({ req, res });
  // TODO validate
  const { id } = req.query;

  await joinLobby(session.user, id as string);

  res.status(204).send(null);
});

const DELETE = createApiHandler(async (req, res) => {
  const session = await requireServerSession({ req, res });
  // TODO validate
  const { id } = req.query;

  await leaveLobby(session.user, id as string);

  res.status(204).send(null);
});

export default methods({ POST, DELETE });
