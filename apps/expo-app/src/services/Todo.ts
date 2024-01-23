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