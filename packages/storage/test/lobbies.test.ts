import { ApiError, User } from "models";
import { createTestStorage } from "./util/storage.js";

const owner: User = { id: "123", name: "Test Owner" };
const user: User = { id: "456", name: "Test User" };

describe("tests regarding the lobby system", () => {
  it("creates a lobby with the correct owner", async () => {
    const storage = await createTestStorage();

    const id = await storage.lobbies.createLobby(owner);

    const lobby = await storage.lobbies.getLobby(id);
    const userLobby = await storage.lobbies.lobbyOf(owner.id);
    const lobbies = await storage.lobbies.getLobbies();

    expect(lobby).toMatchObject({
      owner,
      players: [owner],
    });

    expect(userLobby?.id).toBe(id);

    expect(lobbies).toEqual([lobby]);
  });

  it("users can join a lobby", async () => {
    const storage = await createTestStorage();

    const id = await storage.lobbies.createLobby(owner);

    await storage.lobbies.joinLobby(user, id);

    const userLobby = await storage.lobbies.lobbyOf(user.id);
    const lobby = await storage.lobbies.getLobby(id);

    expect(lobby).toMatchObject({
      owner,
      players: [owner, user],
    });

    expect(userLobby?.id).toBe(id);
  });

  it("users can leave a lobby", async () => {
    const storage = await createTestStorage();

    const id = await storage.lobbies.createLobby(owner);

    await storage.lobbies.joinLobby(user, id);

    await storage.lobbies.leaveLobby(user, id);

    const userLobby = await storage.lobbies.lobbyOf(user.id);
    const lobby = await storage.lobbies.getLobby(id);

    expect(lobby).toMatchObject({
      owner,
      players: [owner],
    });

    expect(userLobby).toBeNull();
  });

  it("deletes a lobby if the last person leaves", async () => {
    const storage = await createTestStorage();

    const id = await storage.lobbies.createLobby(owner);

    await storage.lobbies.leaveLobby(owner, id);

    const userLobby = await storage.lobbies.lobbyOf(owner.id);
    const lobbies = await storage.lobbies.getLobbies();

    expect(userLobby).toBeNull();
    await expect(storage.lobbies.getLobby(id)).rejects.toThrowError(ApiError);
    expect(lobbies).toHaveLength(0);
  });
});
