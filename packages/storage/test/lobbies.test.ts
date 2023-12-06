import { ApiError, User } from "models";
import { joinLobby } from "../src/games.js";
import {
  createLobby,
  getLobbies,
  getLobby,
  leaveLobby,
} from "../src/lobbies.js";
import { statusOf } from "../src/status.js";

const owner: User = { id: "123", name: "Test Owner" };
const user: User = { id: "456", name: "Test User" };

describe("tests regarding the lobby system", () => {
  it("creates a lobby with the correct owner", async () => {
    const id = await createLobby(owner);

    const lobby = await getLobby(id);
    const status = await statusOf(owner.id);
    const lobbies = await getLobbies();

    expect(lobby).toMatchObject({
      owner,
      players: [owner],
    });

    expect(status).toMatchObject({
      type: "lobby",
      id,
    });

    expect(lobbies).toEqual([lobby]);
  });

  it("users can join a lobby", async () => {
    const id = await createLobby(owner);

    await joinLobby(user, id);

    const status = await statusOf(user.id);
    const lobby = await getLobby(id);

    expect(lobby).toMatchObject({
      owner,
      players: [owner, user],
    });

    expect(status).toMatchObject({
      type: "lobby",
      id,
    });
  });

  it("users can leave a lobby", async () => {
    const id = await createLobby(owner);

    await joinLobby(user, id);

    await leaveLobby(user, id);

    const status = await statusOf(user.id);
    const lobby = await getLobby(id);

    expect(lobby).toMatchObject({
      owner,
      players: [owner],
    });

    expect(status.type).toBe("none");
  });

  it("deletes a lobby if the last person leaves", async () => {
    const id = await createLobby(owner);

    await leaveLobby(owner, id);

    const status = await statusOf(owner.id);
    const lobbies = await getLobbies();

    expect(status.type).toBe("none");
    await expect(getLobby(id)).rejects.toThrowError(ApiError);
    expect(lobbies).toHaveLength(0);
  });
});
