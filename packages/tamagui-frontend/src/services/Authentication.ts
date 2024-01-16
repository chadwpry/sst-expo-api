import {
  exchangeCodeAsync, makeRedirectUri, ResponseType, revokeAsync, TokenResponse, useAuthRequest,
} from 'expo-auth-session';
import { add } from 'date-fns';
import * as SecureStore from 'expo-secure-store';
import { env, expoScheme } from '@/services/Configuration';
import { createContext, Reducer, useContext, useReducer, useState } from 'react';

const {
  UserPoolClientId: clientId,
  UserPoolHostUrl: userPoolHostUrl,
} = env;

const ID_TOKEN = 'SecureStoreAuthIdToken';
const ACCESS_TOKEN = 'SecureStoreAuthAccessToken';
const REFRESH_TOKEN = 'SecureStoreAuthRefreshToken';
const ISSUED_AT = 'SecureStoreAuthIssuedAt';
const EXPIRES_IN = 'SecureStoreAuthExpiresIn';

const SCOPES = ["openid", "profile", "email"];

const DISCOVERY_DOCUMENT = {
  authorizationEndpoint: `${userPoolHostUrl}/oauth2/authorize`,
  tokenEndpoint: `${userPoolHostUrl}/oauth2/token`,
  revocationEndpoint: `${userPoolHostUrl}/oauth2/revoke`,
}

const redirectUri = makeRedirectUri({scheme: expoScheme});

const clearAuthState = async () => {
  try {
    await SecureStore.setItemAsync(ID_TOKEN, '');
    await SecureStore.setItemAsync(ACCESS_TOKEN, '');
    await SecureStore.setItemAsync(REFRESH_TOKEN, '');
    await SecureStore.setItemAsync(ISSUED_AT, '');
    await SecureStore.setItemAsync(EXPIRES_IN, '');

  } catch (error) {
    console.error(error);
  }
}

const setAuthState = async (object: TokenResponse) => {
  const {
    idToken = '',
    accessToken,
    refreshToken = '',
    issuedAt,
    expiresIn = 0,
  } = object;

  try {
    await SecureStore.setItemAsync(ID_TOKEN, idToken);
    await SecureStore.setItemAsync(ACCESS_TOKEN, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN, refreshToken);
    await SecureStore.setItemAsync(ISSUED_AT, JSON.stringify(issuedAt));
    await SecureStore.setItemAsync(EXPIRES_IN, JSON.stringify(expiresIn))

  } catch (error) {
    console.error(error);

    return false;
  }

  return true;
}

// PUBLIC

export const isAuthenticated = async () => {
  const idToken = await getIdToken();
  const expiresDate = await getExpiresDate();

  if (idToken) {
    return expiresDate < new Date;
  } else {
    return false;
  }
}

export const useAuthenticationRequest = () => {
  return useAuthRequest({
    clientId,
    responseType: ResponseType.Code,
    redirectUri,
    usePKCE: true,
  }, DISCOVERY_DOCUMENT);
}

export const getExpiresDate = async () => {
  const issuedAt = await SecureStore.getItemAsync(ISSUED_AT);
  const expiresIn = await SecureStore.getItemAsync(EXPIRES_IN);

  let expiresValue: number;

  if (expiresIn) {
    expiresValue = JSON.parse(expiresIn);
  } else {
    expiresValue = 0;
  }

  if (issuedAt) {
    return add(issuedAt || new Date, { minutes: expiresValue });
  } else {
    return new Date;
  }
}

export const getIdToken = async () => {
  return await SecureStore.getItemAsync(ID_TOKEN);
}

export const getIssuedAt = () => {
  const issuedAt = SecureStore.getItemAsync(ISSUED_AT);
}

export const authorize = async (code: string, code_verifier: string) => {
  try {
    const response = await exchangeCodeAsync({
        clientId,
        code,
        redirectUri,
        extraParams: {
          code_verifier,
        },
      }, DISCOVERY_DOCUMENT,
    );

    await setAuthState(response);

    return true;
  } catch (error) {
    console.error(error);
  }

  return false;
}

export const revoke = async () => {
  const token = await SecureStore.getItemAsync(REFRESH_TOKEN);

  if (token) {
    const response = await revokeAsync({
      clientId,
      token,
    }, DISCOVERY_DOCUMENT);

    if (response) {
      try {
        await clearAuthState();

        return true;
      } catch (error) {
        console.log(error);
      }
    }
  }
}
