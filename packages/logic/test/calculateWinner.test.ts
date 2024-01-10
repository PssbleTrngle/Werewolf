import { calculateWinner, validateVote } from "../src/index.js";
import { playerVote, skipVote } from "./util/votes.js";
import { expect } from "vitest";
import { Choice, Player } from "models";

const choiceOf = (letters: string, voteCount = 1, canSkip = true): Choice => ({
  players: letters.split("").map((id) => ({ id }) as Player),
  voteCount,
  canSkip,
});

describe("tests regarding the calculation of vote winners", () => {
  it("skip outweigh player votes", () => {
    const winner = calculateWinner(choiceOf("ABCD"), [
      playerVote("A"),
      playerVote("A"),
      playerVote("A"),
      playerVote("B"),
      playerVote("C"),
      playerVote("D"),
      skipVote(),
      skipVote(),
      skipVote(),
      skipVote(),
    ]);

    expect(winner).toMatchObject(skipVote());
  });

  it("player vote outweighs skips", () => {
    const winner = calculateWinner(choiceOf("ABCD"), [
      playerVote("A"),
      playerVote("A"),
      playerVote("A"),
      playerVote("A"),
      playerVote("B"),
      playerVote("C"),
      playerVote("D"),
      skipVote(),
      skipVote(),
      skipVote(),
    ]);

    expect(winner).toMatchObject(playerVote("A"));
  });

  it("votes tie causes a skip", () => {
    const winner = calculateWinner(choiceOf("ABCD"), [
      playerVote("A"),
      playerVote("A"),
      playerVote("B"),
      playerVote("B"),
      skipVote(),
    ]);

    expect(winner).toMatchObject(skipVote());
  });

  it("vote with multiple selections calculates correctly", () => {
    const winner = calculateWinner(choiceOf("ABCDEF", 2), [
      playerVote("A", "B"),
      playerVote("A", "C"),
      playerVote("C", "E"),
      playerVote("B", "A"),
      playerVote("F", "C"),
      skipVote(),
    ]);

    expect(winner).toMatchObject(playerVote("A", "C"));
  });

  it("vote with multiple selections uses second place", () => {
    const winner = calculateWinner(choiceOf("ABCDEF", 2), [
      playerVote("A", "B"),
      playerVote("A", "C"),
      playerVote("C", "E"),
      playerVote("B", "A"),
      playerVote("F", "A"),
      skipVote(),
    ]);

    expect(winner).toMatchObject(playerVote("A", "B"));
  });

  it("votes tie with multiple selections causes a skip", () => {
    const winner = calculateWinner(choiceOf("ABCDEF", 2), [
      playerVote("A", "B"),
      playerVote("A", "C"),
      playerVote("C", "E"),
      playerVote("B", "A"),
      playerVote("B", "C"),
      skipVote(),
    ]);

    expect(winner).toMatchObject(skipVote());
  });

  it("vote with multiple same selections throws error", () => {
    expect(() =>
      validateVote(choiceOf("ABC", 2), playerVote("B", "B")),
    ).toThrowError();
  });

  it("vote with to many selections throws error", () => {
    expect(() =>
      validateVote(choiceOf("ABC"), playerVote("A", "B")),
    ).toThrowError();
  });

  it("vote with to few selections throws error", () => {
    expect(() =>
      validateVote(choiceOf("ABC", 2), playerVote("A")),
    ).toThrowError();
  });

  it("skip vote without canSkip choice throws error", () => {
    expect(() =>
      validateVote(choiceOf("ABC", 1, false), skipVote()),
    ).toThrowError();
  });

  it("vote with invalid selections throws error", () => {
    expect(() =>
      validateVote(choiceOf("ABC", 2), playerVote("A", "F")),
    ).toThrowError();
  });
});
