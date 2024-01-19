import * as SecureStore from 'expo-secure-store';
import { env } from '@/services/Configuration';

const {
  ApiEndpoint: apiEndpoint,
  ID_TOKEN_KEY,
} = env;

const getIdToken = async (): Promise<string> => {
  const idToken = await SecureStore.getItemAsync(ID_TOKEN_KEY) || '';

  // if (!idToken) {
  //   throw new Error('Attempting to request an idToken that does not exist');
  // }

  return idToken;
}

export type ProfileType = {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
};

export const get = async (): Promise<ProfileType> => {
  const idToken = await getIdToken();
  const response = await fetch(apiEndpoint + '/profile', {
    method: "GET",
    headers: {
      Authorization: idToken,
    },
  });

  return response.json();
}

export type PutRequestType = {
  profile: ProfileType;
}

export const put = async ({ profile }: PutRequestType): Promise<boolean> => {
  const idToken = await getIdToken();
  const response = await fetch(apiEndpoint + '/profile', {
    method: "PUT",
    headers: {
      Authorization: idToken,
    },
    body: JSON.stringify(profile),
  });

  return response.status === 200;
}