export type Time = "day" | "night" | "dawn" | "dusk";

export interface GameStatus {
  day: number;
  time: Time;
}
