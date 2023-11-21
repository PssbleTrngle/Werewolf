import { Player } from "./Player.js";

export interface Choice {
  canSkip?: boolean;
  players?: ReadonlyArray<Player>;
  voteCount?: number;
}
