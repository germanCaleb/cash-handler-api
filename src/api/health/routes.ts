import { Router } from 'express';
import { healthHandler } from './controller';

const healthRouter = Router();
healthRouter.get('', healthHandler);

export default healthRouter;
