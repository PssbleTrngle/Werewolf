import { createApiHandler, methods } from "@/lib/server/apiHandlers";
import { VoteSchema } from "@/lib/server/schemas";
import { requireSessionView } from "@/lib/server/session";
import { Vote } from "models";

const POST = createApiHandler(async (req, res) => {
  const view = await requireSessionView({ req, res });

  const vote: Vote = VoteSchema.parse(req.body);

  await view.vote(vote);

  res.status(204).send(null);
});

export default methods({ POST });
