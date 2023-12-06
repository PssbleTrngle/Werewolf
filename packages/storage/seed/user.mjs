export default function fakeUser(faker) {
  return {
    id: faker.database.mongodbObjectId(),
    name: faker.internet.userName(),
  };
}
