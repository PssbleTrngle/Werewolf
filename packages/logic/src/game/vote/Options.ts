import { Player } from "../player/Player";

export interface Choice {
  allowSkip?: boolean;
  voteCount?: number;
  players: ReadonlyArray<Player>;
}
