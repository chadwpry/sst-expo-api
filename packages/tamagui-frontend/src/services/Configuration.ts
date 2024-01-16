import eas from '../../eas.json';
import appJson from '../../app.json';

const stage = 'development';

export const env = {
  ...eas.build[stage].env,
};

if (process.env.DEBUG) {
  console.log('Configuration', env);
}

export const expoScheme = appJson.expo.scheme;
