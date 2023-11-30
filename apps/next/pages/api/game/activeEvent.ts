import { StartEvent } from "logic";
import { Event } from "models";
import type { NextApiHandler } from "next";

const handler: NextApiHandler<Event<unknown>> = async (req, res) => {
  res.status(200).json(StartEvent.create([]));
};

export default handler;
