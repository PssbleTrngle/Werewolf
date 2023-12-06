import { joinLobby, leaveLobby } from "storage";
import { createApiHandler, methods } from "@/lib/server/apiHandlers";
import { IdParameter } from "@/lib/server/schemas";
import { requireServerSession } from "@/lib/server/session";

const POST = createApiHandler(async (req, res) => {
  const session = await requireServerSession({ req, res });
  const { id } = IdParameter.parse(req.query);

  await joinLobby(session.user, id);

  res.status(204).send(null);
});

const DELETE = createApiHandler(async (req, res) => {
  const session = await requireServerSession({ req, res });
  const { id } = IdParameter.parse(req.query);

  await leaveLobby(session.user, id);

  res.status(204).send(null);
});

export default methods({ POST, DELETE });
