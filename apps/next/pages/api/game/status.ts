import { GameStatus } from "models";
import { createApiHandler, methods } from "../../../lib/server/apiHandlers";
import { sessionView } from "../../../lib/server/session";

const GET = createApiHandler<GameStatus | null>(async (req, res) => {
  const view = await sessionView({ req, res });

  const status = view ? view.status() : null;
  res.status(200).json(status);
});

export default methods({ GET });
