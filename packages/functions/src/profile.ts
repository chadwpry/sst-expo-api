import crypto from "crypto";
import { Bucket } from "sst/node/bucket";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ApiHandler } from "sst/node/api";
import { faker } from '@faker-js/faker';

export const get = ApiHandler(async (_event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      profilePicture: faker.image.avatar(),
    }),
  };
});

export const put = ApiHandler(async (event) => {
  return {
    statusCode: 200,
  }
});