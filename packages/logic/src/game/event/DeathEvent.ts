import { DeathData, Time } from "models";
import { TimeEffect } from "../effect/TimeEffect.js";
import { Player } from "../player/Player.js";
import { DismissChoice } from "../vote/Choice.js";
import { Event } from "./Event.js";
import { EventBus } from "./EventBus.js";

export const DeathEvents = new EventBus();

export class DeathEvent extends Event implements DeathData {
  constructor(
    players: ReadonlyArray<Player>,
    public readonly deaths: ReadonlyArray<Player>,
    private readonly time?: Time
  ) {
    super("announcement.death", players, DismissChoice);
  }

  finish() {
    if (this.time) return new TimeEffect(this.time);
    return [];
  }
}
