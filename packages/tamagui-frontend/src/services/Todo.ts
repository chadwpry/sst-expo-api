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

export type TodoType = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  dueDate: Date;
  startDate: Date;
  completeDate: Date;
};

export const list = async (): Promise<TodoType[]> => {
  const idToken = await getIdToken();
  const response = await fetch(apiEndpoint + '/todos', {
    method: "GET",
    headers: {
      Authorization: idToken,
    },
  });

  return response.json();
}