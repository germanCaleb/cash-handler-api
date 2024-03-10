import { verifyPayloadSchema } from '../middleware/middleware';
import { Router } from 'express';
import { isUserCreation, isUserLogin, isUserPasswordReset } from './models';
import {
  createUserHandler,
  loginHandler,
  resetPasswordEmailHandler,
  resetPasswordHandler,
  verifyUserHandler
} from './controller';

const userRouter = Router();
userRouter.post(
  '/create',
  verifyPayloadSchema(isUserCreation),
  createUserHandler
);
userRouter.get('/verify/:userKey', verifyUserHandler);
userRouter.get('/reset_password/:email', resetPasswordEmailHandler);
userRouter.patch(
  '/password_reset',
  verifyPayloadSchema(isUserPasswordReset),
  resetPasswordHandler
);
userRouter.post('/login', verifyPayloadSchema(isUserLogin), loginHandler);
export default userRouter;
