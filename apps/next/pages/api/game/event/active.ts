import { Event } from "models";
import type { NextApiHandler } from "next";
import { methods } from "../../../../lib/methodHandlers";
import { sessionView } from "../../../../lib/session";

const GET: NextApiHandler<Event<unknown>> = async (req, res) => {
  const view = await sessionView(req, res);

  res.status(200).json(view.currentEvent());
};

export default methods({ GET });
