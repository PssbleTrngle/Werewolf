import { ArrayOrSingle, arrayOrSelf, notNull } from "../util";
import { Effect } from "./effect/Effet";
import { Event } from "./event/Event";
import { StartEvent } from "./event/StartEvent";
import { DeathCause } from "./player/DeathCause";
import { Player } from "./player/Player";
import { Vote, calculateWinner } from "./vote/Vote";

interface GameState {
  players: ReadonlyArray<Player>;
  events: ReadonlyArray<Event>;
}

class StateHistory {
  private history: GameState[];

  constructor(initial: GameState) {
    this.history = [initial];
  }

  get current() {
    return this.history[this.history.length - 1];
  }

  push(next: GameState) {
    this.history.push(next);
  }

  modify(factory: (previous: GameState) => Partial<GameState>) {
    const current = this.current;
    this.push({ ...current, ...factory(current) });
  }
}

export class Game {
  private state: StateHistory;
  private votes = new Map<Player["id"], Vote>();

  constructor(players: ReadonlyArray<Player>) {
    this.state = new StateHistory({
      players,
      events: [new StartEvent(players)],
    });
  }

  get players() {
    return this.state.current.players;
  }

  get events() {
    return this.state.current.events;
  }

  start() {
    this.check();
  }

  private check() {
    this.currentEvents().forEach((event) => {
      const arrived = event.players.filter(
        (it) => this.currentEvent(it) === event
      );

      // some players still have something to do
      if (arrived.length < event.players.length) return;

      let vote: Vote = { type: "skip" };
      if (event.choice) {
        const votes = event.players
          .map((it) => this.votes.get(it.id))
          .filter(notNull);

        // not everybody has voted yet
        if (votes.length < event.players.length) return;

        vote = calculateWinner(votes);
      }

      const effects = event.finish(vote);
      this.apply(effects);

      this.state.modify((it) => ({
        events: it.events.filter((e) => e !== event),
      }));
    });
  }

  eventsFor(player: Player) {
    return this.events.filter((it) => it.players.includes(player));
  }

  currentEvent(player: Player) {
    return this.events.find((it) => it.players.includes(player));
  }

  currentEvents() {
    return this.events.filter((event) => {
      return event.players.some((it) => this.currentEvent(it) === event);
    });
  }

  private apply(effects: ArrayOrSingle<Effect>) {
    arrayOrSelf(effects).forEach((it) => it.apply(this));
  }

  arise(event: ArrayOrSingle<Event>) {
    this.state.modify((it) => ({
      events: [...it.events, ...arrayOrSelf(event)],
    }));
  }

  kill(target: Player, cause: DeathCause) {
    console.log(target.name, "died by", cause);

    const effects = target.role.onDeath(target);
    this.apply(effects);

    this.state.modify((it) => ({
      players: it.players.map((player) => {
        if (player.id !== target.id) return player;
        return { ...player, status: "dead" };
      }),
    }));
  }

  vote(player: Player, vote: Vote) {
    if (!this.currentEvent(player)?.choice) return;

    console.log(player.name, "voted");
    this.votes.set(player.id, vote);

    this.check();
  }
}
