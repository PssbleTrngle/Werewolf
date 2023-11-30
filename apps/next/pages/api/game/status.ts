import { GameStatus } from "models";
import type { NextApiHandler } from "next";
import { methods } from "../../../lib/methodHandlers";
import { sessionView } from "../../../lib/session";

const GET: NextApiHandler<GameStatus | null> = async (req, res) => {
  const view = await sessionView(req, res);

  res.status(200).json(view.status());
};

export default methods({ GET });
