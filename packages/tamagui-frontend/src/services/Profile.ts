import { env } from '@/services/Configuration';
import { getIdToken } from '@/services/Authentication';

const {
  ApiEndpoint: apiEndpoint,
} = env;

export type ProfileType = {
  name: string;
  email: string;
  profilePicture: string;
}

export const get = async (): Promise<ProfileType> => {
  const idToken = await getIdToken() || '';
  const response = await fetch(apiEndpoint + '/profile', {
    method: "GET",
    headers: {
      Authorization: idToken,
    },
  });

  return response.json();
}

export const put = async (profile: ProfileType): Promise<boolean> => {
  const idToken = await getIdToken() || '';
  const response = await fetch(apiEndpoint + '/profile', {
    method: "PUT",
    headers: {
      Authorization: idToken,
    },
    body: JSON.stringify(profile),
  });

  return response.status === 200;
}