import { ApiHandler } from "sst/node/api";
import { faker } from '@faker-js/faker';

export const get = ApiHandler(async (_event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      profilePicture: faker.image.avatar(),
    }),
  };
});

export const put = ApiHandler(async (event) => {
console.log('event', event.body);

return {
    statusCode: 200,
  }
})