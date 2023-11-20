import { maxBy, uniqBy } from "lodash-es";
import { Player } from "../player/Player";

export interface SkipVote {
  type: "skip";
}

export interface PlayerVote {
  type: "players";
  players: ReadonlyArray<Player>;
}

export type Vote = PlayerVote | SkipVote;

function isPlayerVote(vote: Vote): vote is PlayerVote {
  return vote.type === "players";
}

export function calculateWinner(votes: ReadonlyArray<Vote>): Vote {
  const skipVotes = votes.filter((it) => it.type === "skip");

  const playerVotes = votes.filter(isPlayerVote);
  const players = uniqBy(
    playerVotes.flatMap((it) => it.players),
    (it) => it.id
  );

  const withAmount = players.map((player) => {
    const votes = playerVotes.filter((it) => it.players.includes(player));
    return { player, votes: votes.length };
  });

  const winningPlayerVoteAmount =
    maxBy(withAmount, (it) => it.votes)?.votes ?? -1;

  if (skipVotes.length >= winningPlayerVoteAmount) {
    return { type: "skip" };
  }

  const winners = withAmount
    .filter((it) => it.votes === winningPlayerVoteAmount)
    .map((it) => it.player);

  return { type: "players", players: winners };
}
