import { maxBy, orderBy, uniq } from "lodash-es";
import { ApiError, Choice, PlayerVote, Vote } from "models";
import { byId } from "../player/predicates.js";

function isPlayerVote(vote: Vote): vote is PlayerVote {
  return vote.type === "players";
}

export function validateVote(choice: Choice, vote: Vote) {
  if (vote.type === "skip" && !choice.canSkip) {
    throw new ApiError(400, "cannot skip on this choice");
  }

  if (vote.type === "players") {
    const voteCount = choice.voteCount ?? 1;

    if (vote.players.some((it) => !choice.players?.find(byId(it)))) {
      throw new ApiError(400, "invalid player selection");
    }

    if (uniq(vote.players).length !== vote.players.length) {
      throw new ApiError(
        400,
        "vote contains the same selection mulitple times",
      );
    }

    if (vote.players.length !== voteCount) {
      throw new ApiError(
        400,
        `expected a choice of ${voteCount} players, ${vote.players.length} given`,
      );
    }
  }
}

export function calculateWinner(
  choice: Choice,
  votes: ReadonlyArray<Vote>,
): Vote {
  const skipVotes = votes.filter((it) => it.type === "skip");

  const voteCount = choice.voteCount ?? 1;

  const playerVotes = votes.filter(isPlayerVote);

  const chosenPlayers = uniq(playerVotes.flatMap((it) => it.players));

  if (chosenPlayers.length === 0) return { type: "skip" };

  const withAmount = chosenPlayers.map((player) => {
    const votes = playerVotes.filter((it) => it.players.includes(player));
    return { player, votes: votes.length };
  });

  const { votes: maxPlayerVote } = maxBy(withAmount, (it) => it.votes)!;

  if (voteCount === 1) {
    if (skipVotes.length >= maxPlayerVote) {
      return { type: "skip" };
    }
  }

  const firstPlace = withAmount.filter((it) => it.votes === maxPlayerVote);

  // A tie has occured
  if (firstPlace.length > voteCount) {
    return { type: "skip" };
  }

  const winners = orderBy(withAmount, (it) => it.votes, "desc")
    .map((it) => it.player)
    .slice(0, voteCount);

  return { type: "players", players: winners };
}
