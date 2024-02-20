import dotenvFlow from 'dotenv-flow';
import { AppSettings } from './App.Settings';

let appSettings: AppSettings;

const validAppSettings = () =>
  process.env.WEB_PORT &&
  process.env.HOST_NAME &&
  process.env.EMAIL_USER_NAME &&
  process.env.EMAIL_PASSWORD &&
  process.env.JWT_SIGN_SECRET &&
  process.env.ISSUER;

export const initAppSettings = (): AppSettings => {
  dotenvFlow.config();
  if (!validAppSettings()) throw new Error('Invalid App Setting');
  if (!appSettings)
    appSettings = {
      WEB_PORT: Number(process.env.WEB_PORT),
      HOST_NAME: process.env.HOST_NAME as string,
      EMAIL_USER_NAME: process.env.EMAIL_USER_NAME as string,
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
      JWT_SIGN_SECRET: process.env.JWT_SIGN_SECRET as string,
      ISSUER: process.env.ISSUER as string
    };
  return appSettings;
};

export const getAppSettings = () => {
  if (!appSettings) return initAppSettings();
  return appSettings;
};
