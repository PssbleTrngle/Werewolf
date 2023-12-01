import { Vote } from "models";
import { createApiHandler, methods } from "../../../lib/server/apiHandlers";
import { requireSessionView } from "../../../lib/server/session";

const POST = createApiHandler(async (req, res) => {
  const view = await requireSessionView({ req, res });

  // TODO verification
  const vote: Vote = req.body;

  view.vote(vote);

  res.status(204).send(null);
});

export default methods({ POST });
