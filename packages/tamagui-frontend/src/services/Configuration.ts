import eas from '../../eas.json';
import appJson from '../../app.json';

const stage = 'development';

export const env = {
  ...eas.build[stage].env,
  ID_TOKEN_KEY: 'SecureStoreAuthIdToken',
  ACCESS_TOKEN_KEY: 'SecureStoreAuthAccessToken',
  REFRESH_TOKEN_KEY: 'SecureStoreAuthRefreshToken',
  ISSUED_AT_KEY: 'SecureStoreAuthIssuedAt',
  EXPIRES_IN_KEY: 'SecureStoreAuthExpiresIn',
};

if (process.env.DEBUG) {
  console.log('Configuration', env);
}

export const expoScheme = appJson.expo.scheme;
