import React from 'react';
import {
  AuthRequest, exchangeCodeAsync, makeRedirectUri,
  ResponseType, revokeAsync, TokenResponse,
} from 'expo-auth-session';
import { add } from 'date-fns';
import * as SecureStore from 'expo-secure-store';
import * as ProfileService from '@services/Profile';

const {
  EXPO_PUBLIC_USER_POOL_CLIENT_ID: clientId = '',
  EXPO_PUBLIC_USER_POOL_HOST_URL: userPoolHostUrl,
  EXPO_PUBLIC_ID_TOKEN_KEY: idTokenKey = '',
  EXPO_PUBLIC_ACCESS_TOKEN_KEY: accessTokenKey = '',
  EXPO_PUBLIC_REFRESH_TOKEN_KEY: refreshTokenKey = '',
  EXPO_PUBLIC_ISSUED_AT_KEY: issuedAtKey = '',
  EXPO_PUBLIC_EXPIRES_IN_KEY: expiresInKey = '',
} = process.env;

if (clientId === '') {
  throw new Error("env clientId missing in Authentication service");
}

if (userPoolHostUrl === '') {
  throw new Error("env userPoolHostUrl missing in Authentication service");
}

if (idTokenKey === '') {
  throw new Error("env idTokenKey missing in Authentication service");
}

if (accessTokenKey === '') {
  throw new Error("env accessTokeyKey missing in Authentication service");
}

if (refreshTokenKey === '') {
  throw new Error("env refreshTokenKey missing in Authentication service");
}

if (issuedAtKey === '') {
  throw new Error("env issuedAtKey missing in Authentication service");
}

if (expiresInKey === '') {
  throw new Error("env expiresInKey missing in Authentication service");
}

const DISCOVERY_DOCUMENT = {
  authorizationEndpoint: `${userPoolHostUrl}/oauth2/authorize`,
  tokenEndpoint: `${userPoolHostUrl}/oauth2/token`,
  revocationEndpoint: `${userPoolHostUrl}/oauth2/revoke`,
}

const redirectUri = makeRedirectUri({
  // isTripleSlashed: true,
  // path: '(profile)',
  scheme: 'expo-template',
});

const clearAuthState = async () => {
  try {
    await SecureStore.setItemAsync(idTokenKey, '');
    await SecureStore.setItemAsync(accessTokenKey, '');
    await SecureStore.setItemAsync(refreshTokenKey, '');
    await SecureStore.setItemAsync(issuedAtKey, '');
    await SecureStore.setItemAsync(expiresInKey, '');

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
    await SecureStore.setItemAsync(idTokenKey, idToken);
    await SecureStore.setItemAsync(accessTokenKey, accessToken);
    await SecureStore.setItemAsync(refreshTokenKey, refreshToken);
    await SecureStore.setItemAsync(issuedAtKey, JSON.stringify(issuedAt));
    await SecureStore.setItemAsync(expiresInKey, JSON.stringify(expiresIn))

  } catch (error) {
    console.error(error);

    return false;
  }

  return true;
}

// PUBLIC

export const getExpiresDate = async () => {
  const issuedAt = await SecureStore.getItemAsync(issuedAtKey);
  const expiresIn = await SecureStore.getItemAsync(expiresInKey);

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

export const getIdToken = async (): Promise<string> => {
  const idToken = await SecureStore.getItemAsync(idTokenKey) || '';

  // if (!idToken) {
  //   throw new Error('Attempting to request an idToken that does not exist');
  // }

  return idToken;
}

export const getIssuedAt = () => {
  const issuedAt = SecureStore.getItemAsync(issuedAtKey);
}

type Action =
  | { type: 'PROFILE-UPDATE-BEGIN' }
  | { type: 'PROFILE-UPDATE-END', data: { profile: ProfileService.ProfileType } }
  | { type: 'SIGN-IN-BEGIN' }
  | { type: 'SIGN-IN-END', data: { profile: ProfileService.ProfileType } }
  | { type: 'SIGN-OUT-BEGIN' }
  | { type: 'SIGN-OUT-END' }
  | { type: 'UPDATE-PROFILE', data?: {
      isAuthenticated: boolean,
      profile?: ProfileService.ProfileType }};

type DispatchType = (action: Action) => void;

type StateType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  profile?: ProfileService.ProfileType,
}

type AuthenticationProviderProps = {
  children: React.ReactNode
}

function reducer(state: StateType, action: Action) {
  switch (action.type) {
    case 'PROFILE-UPDATE-BEGIN':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: true,
      }
    case 'PROFILE-UPDATE-END':
      const { profile } = action.data;

      return {
        isAuthenticated: true,
        isLoading: false,
        profile,
      }
    case 'SIGN-IN-BEGIN':
      return {
        isAuthenticated: false,
        isLoading: true,
      }
    case 'SIGN-IN-END':
      return {
        isAuthenticated: true,
        isLoading: false,
        profile: action.data.profile,
      }
    case 'SIGN-OUT-BEGIN':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: true,
      }
    case 'SIGN-OUT-END':
      return {
        isAuthenticated: false,
        isLoading: false,
      }
    }

  return state;
}

const AuthenticationContext = React.createContext<
  {state: StateType, dispatch: DispatchType} | undefined
>(undefined);

export const AuthenticationProvider = ({ children }: AuthenticationProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, { isAuthenticated: false, isLoading: false });

  const value = {state, dispatch};

  return (
    <AuthenticationContext.Provider value={value}>
      { children }
    </AuthenticationContext.Provider>
  );
}


export const useAuthentication = () => {
  const context = React.useContext(AuthenticationContext);
  const request = new AuthRequest({
    clientId,
    responseType: ResponseType.Code,
    redirectUri,
    usePKCE: true,
  });

  if (context === undefined) {
    throw new Error('useAuthentication must be used within an AuthenticationContext');
  }

  const { state, dispatch } = context;

  return {
    isAuthenticated: context.state.isAuthenticated,
    isLoading: context.state.isLoading,
    profile: context.state.profile,

    profileUpdate: async (profile: ProfileService.ProfileType) => {
      return await handleProfileUpdate({ state, dispatch, profile });
    },
    signIn: async () => {
      await handleSignIn({ state, dispatch, request });
    },
    signOut: async () => {
      return await handleSignOut({ state, dispatch });
    }
  };
}

type SignInType = {
  state: StateType;
  dispatch: DispatchType,
  request: AuthRequest,
}

const handleSignIn = async ({ state, dispatch, request }: SignInType) => {
  dispatch({ type: 'SIGN-IN-BEGIN' });

  const result = await request.promptAsync(DISCOVERY_DOCUMENT);

  if (result?.type === 'success') {
    if (!request?.codeVerifier) {
      throw new Error('Missing code verifier in authentication/authorization request');
    }

    const authorizeResponse = await authorize(result.params.code, request?.codeVerifier);

    if (authorizeResponse) {
      const profile = await ProfileService.get();

      dispatch({ type: 'SIGN-IN-END', data: { profile } });
    }
  }
}

const authorize = async (code: string, code_verifier: string) => {
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

type SignOutType = {
  state: StateType;
  dispatch: DispatchType,
}

const handleSignOut = async ({ state, dispatch }: SignOutType) => {
  dispatch({ type: 'SIGN-OUT-BEGIN' });

  const token = await SecureStore.getItemAsync(refreshTokenKey);

  if (token) {
    const response = await revokeAsync({
      clientId,
      token,
    }, DISCOVERY_DOCUMENT);

    if (response) {
      try {
        await clearAuthState();

        dispatch({ type: 'SIGN-OUT-END' });

        return true;
      } catch (error) {
        console.log(error);
      }
    }
  }
}

type ProfileUpdateType = {
  state: StateType;
  dispatch: DispatchType,
  profile: ProfileService.ProfileType,
}

const handleProfileUpdate = async ({ state, dispatch, profile }: ProfileUpdateType): Promise<boolean> => {
  dispatch({ type: 'PROFILE-UPDATE-BEGIN' });

  const result = await ProfileService.put({ profile });

  if (result) {
    dispatch({ type: 'PROFILE-UPDATE-END', data: { profile } });

    return true;
  } else {
    throw new Error('Failed to update profile -> move this to a toast');
  }
}