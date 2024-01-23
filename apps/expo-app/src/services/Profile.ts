import * as SecureStore from 'expo-secure-store';

const {
  EXPO_PUBLIC_API_ENDPOINT: apiEndpoint = '',
  EXPO_PUBLIC_ID_TOKEN_KEY: idTokenKey = '',
} = process.env

if (apiEndpoint === '') {
  throw new Error("env apiEndpoint missing in Authentication service");
}

if (idTokenKey === '') {
  throw new Error("env idTokenKey missing in Authentication service");
}

const getIdToken = async (): Promise<string> => {
  const idToken = await SecureStore.getItemAsync(idTokenKey) || '';

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