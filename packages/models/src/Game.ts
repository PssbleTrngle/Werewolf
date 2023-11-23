export type Time = "day" | "night" | "dawn" | "dusk";

export interface EventQueue {
  past: number;
  writtenFuture: number;
  unknownFuture: number;
}

export interface GameStatus {
  day: number;
  time: Time;
  queue?: EventQueue;
}
