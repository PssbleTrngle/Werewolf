import { Lobby, createLobby, getLobbies } from "storage";
import { createApiHandler, methods } from "../../../lib/server/apiHandlers";
import { requireServerSession } from "../../../lib/server/session";

const POST = createApiHandler(async (req, res) => {
  const session = await requireServerSession({ req, res });

  await createLobby(session.user);

  res.status(204).send(null);
});

const GET = createApiHandler<ReadonlyArray<Lobby>>(async (req, res) => {
  const lobbies = await getLobbies();

  res.status(200).json(lobbies);
});

export default methods({ GET, POST });
