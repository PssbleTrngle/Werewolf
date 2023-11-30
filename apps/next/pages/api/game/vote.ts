import { Vote } from "models";
import type { NextApiHandler } from "next";
import { methods } from "../../../lib/methodHandlers";
import { sessionView } from "../../../lib/session";

const POST: NextApiHandler = async (req, res) => {
  const view = await sessionView(req, res);

  // TODO verification
  const vote: Vote = req.body;

  console.log(vote);

  view.vote(vote);

  res.status(204).send(null);
};

export default methods({ POST });
