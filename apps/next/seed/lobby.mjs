import fakeUser from "./user.mjs";

export default function fakeLobby(faker) {
  const players = new Array(faker.number.int({ min: 1, max: 24 }))
    .fill(null)
    .map(() => fakeUser(faker));

  return {
    id: faker.database.mongodbObjectId(),
    players,
    owner: players[0],
    settings: {},
  };
}
