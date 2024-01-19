import React from 'react';
import {
  AuthRequest, exchangeCodeAsync, makeRedirectUri,
  ResponseType, revokeAsync, TokenResponse,
} from 'expo-auth-session';
import { add } from 'date-fns';
import * as SecureStore from 'expo-secure-store';
import { env, expoScheme } from '@/services/Configuration';
import * as ProfileService from '@/services/Profile';

const {
  UserPoolClientId: clientId,
  UserPoolHostUrl: userPoolHostUrl,
  ID_TOKEN_KEY,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  ISSUED_AT_KEY,
  EXPIRES_IN_KEY,
} = env;

const DISCOVERY_DOCUMENT = {
  authorizationEndpoint: `${userPoolHostUrl}/oauth2/authorize`,
  tokenEndpoint: `${userPoolHostUrl}/oauth2/token`,
  revocationEndpoint: `${userPoolHostUrl}/oauth2/revoke`,
}

const redirectUri = makeRedirectUri({
  // isTripleSlashed: true,
  // path: '(profile)',
  scheme: expoScheme,
});

const clearAuthState = async () => {
  try {
    await SecureStore.setItemAsync(ID_TOKEN_KEY, '');
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, '');
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, '');
    await SecureStore.setItemAsync(ISSUED_AT_KEY, '');
    await SecureStore.setItemAsync(EXPIRES_IN_KEY, '');

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
    await SecureStore.setItemAsync(ID_TOKEN_KEY, idToken);
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    await SecureStore.setItemAsync(ISSUED_AT_KEY, JSON.stringify(issuedAt));
    await SecureStore.setItemAsync(EXPIRES_IN_KEY, JSON.stringify(expiresIn))

  } catch (error) {
    console.error(error);

    return false;
  }

  return true;
}

// PUBLIC

export const getExpiresDate = async () => {
  const issuedAt = await SecureStore.getItemAsync(ISSUED_AT_KEY);
  const expiresIn = await SecureStore.getItemAsync(EXPIRES_IN_KEY);

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
  const idToken = await SecureStore.getItemAsync(ID_TOKEN_KEY) || '';

  // if (!idToken) {
  //   throw new Error('Attempting to request an idToken that does not exist');
  // }

  return idToken;
}

export const getIssuedAt = () => {
  const issuedAt = SecureStore.getItemAsync(ISSUED_AT_KEY);
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

  const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

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