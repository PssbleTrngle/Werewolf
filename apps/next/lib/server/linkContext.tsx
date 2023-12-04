"use server";

import { allRoles } from "logic";
import { Session } from "next-auth";
import { GameContext } from "ui";
import { requireSessionView } from "./session";

function NOOP(): never {
  throw new Error("not supported");
}

export default function createLinkContext(session: Session): GameContext {
  const view = requireSessionView(session);

  return {
    roles: async () => allRoles,
    players: () => view.then((it) => it.players()),
    game: () => view.then((it) => it.status()),
    activeEvent: () => view.then((it) => it.currentEvent()),

    submitVote: NOOP,
    undo: NOOP,
    redo: NOOP,
    stop: NOOP,
    create: NOOP,
  };
}
