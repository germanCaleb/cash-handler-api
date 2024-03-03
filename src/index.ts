import express, { Express } from 'express';
import { initAppSettings } from './services/app.settings/app.settings.service';
import healthRouter from './api/health/routes';
import userRouter from './api/user/routes';
import bodyParser from 'body-parser';

export const app: Express = express();

const main = () => {
  const { WEB_PORT } = initAppSettings();
  app.use(bodyParser.json());
  app.use('/health', healthRouter);
  app.use('/user', userRouter);
  app.listen(WEB_PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${WEB_PORT}`);
  });
};

main();
