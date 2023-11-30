import { GameStatus } from "models";
import type { NextApiHandler } from "next";

const handler: NextApiHandler<GameStatus | null> = async (req, res) => {
  res.status(200).json({ day: 1, time: "day" });
};

export default handler;
