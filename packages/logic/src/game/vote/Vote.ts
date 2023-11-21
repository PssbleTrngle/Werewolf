import { maxBy, uniq } from "lodash-es";
import { PlayerVote, Vote } from "models";

function isPlayerVote(vote: Vote): vote is PlayerVote {
  return vote.type === "players";
}

export function calculateWinner(votes: ReadonlyArray<Vote>): Vote {
  const skipVotes = votes.filter((it) => it.type === "skip");

  const playerVotes = votes.filter(isPlayerVote);
  const players = uniq(playerVotes.flatMap((it) => it.players));

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
