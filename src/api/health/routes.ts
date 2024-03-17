import { Router } from 'express';
import { healthHandler } from './controller';
import { verifyUserJwtToken } from '../middleware/middleware';

const healthRouter = Router();
healthRouter.get('', verifyUserJwtToken(undefined), healthHandler);
export default healthRouter;
