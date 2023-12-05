import { Id } from "./Player.js";

export interface ActiveGameStatus {
  type: "game";
  id: Id;
}

export interface NoGameStatus {
  type: "none";
}

export interface LobbyGameStatus {
  type: "lobby";
  id: Id;
}

export type GameStatus = ActiveGameStatus | NoGameStatus | LobbyGameStatus;
