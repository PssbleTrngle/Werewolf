import { Player } from "../player/Player.js";

export interface Choice {
  canSkip?: boolean;
  voteCount?: number;
  players: ReadonlyArray<Player>;
}

export const DismissChoice: Choice = {
  canSkip: true,
  players: [],
};
