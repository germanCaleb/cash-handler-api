import { verifyPayloadSchema } from '../middleware/middleware';
import { Router } from 'express';
import { isUserCreation } from './models';
import { createUserHandler } from './controller';

const userRouter = Router();
userRouter.post(
  '/create',
  verifyPayloadSchema(isUserCreation),
  createUserHandler
);

export default userRouter;
