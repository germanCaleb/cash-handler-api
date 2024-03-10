import { Request, Response } from 'express';
import { UserCreation } from './models';
import {
  createAndSignUserToken,
  createUser,
  findUserByEmail,
  updatePassword,
  verifyUser,
  verifyUserPassword
} from './service';
import { HttpError } from '../common/models';
import { sendResetEmail } from '../../services/email/email';

export const createUserHandler = async (
  request: Request,
  response: Response
) => {
  const body = request.body as UserCreation;
  try {
    const user = await createUser(body);
    response.status(201).send({ userKey: user.userKey });
  } catch (error: unknown) {
    return response
      .status((error as HttpError).status ?? 500)
      .send('Can Not Create User.');
  }
};

export const verifyUserHandler = async (
  request: Request,
  response: Response
) => {
  const userKey = request.params.userKey;
  try {
    await verifyUser(userKey);
    return response.redirect('http://localhost:5173/registered');
  } catch (error: unknown) {
    return response
      .status((error as HttpError).status ?? 500)
      .send('Can Not Verify User');
  }
};

export const resetPasswordEmailHandler = async (
  request: Request,
  response: Response
) => {
  const email = request.params.email;
  try {
    sendResetEmail(email);
    return response.status(200).send();
  } catch (error: unknown) {
    return response
      .status((error as HttpError).status ?? 500)
      .send('Can Not Reset Password');
  }
};

export const resetPasswordHandler = async (
  request: Request,
  response: Response
) => {
  const { email, newPassword } = request.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return response.status(401).send({ message: 'Invalid Email' });
    updatePassword(newPassword, email, user.salt);
    return response.status(200).send();
  } catch (error: unknown) {
    return response
      .status((error as HttpError).status ?? 500)
      .send('Server Can Not Update Password');
  }
};

export const loginHandler = async (request: Request, response: Response) => {
  const { body } = request;
  try {
    // find user by email
    const user = await findUserByEmail(body.email);
    if (!user)
      return response
        .status(401)
        .send({ message: 'Invalid Email or Password' });
    // verify Password
    if (!(await verifyUserPassword(body.password, user)))
      return response
        .status(401)
        .send({ message: 'Invalid Email or Password' });
    // check if account is verified
    if (!user.verifiedEmail)
      return response.status(401).send({
        message:
          'Please Validate Email, Check Your Email For Verification Email'
      });
    // generate Access Token
    const accessToken = createAndSignUserToken(user);
    // respond
    return response.status(200).send({ accessToken });
  } catch (error: unknown) {
    return response
      .status((error as HttpError).status ?? 500)
      .send('Can Not Login');
  }
};
