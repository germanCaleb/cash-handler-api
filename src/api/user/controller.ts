import { Request, Response } from 'express';
import { UserCreation } from './models';
import { createUser } from './service';

export const createUserHandler = async (
  request: Request,
  response: Response
) => {
  const body = request.body as UserCreation;
  try {
    const user = await createUser(body);
    response.status(201).send({ userKey: user.userKey });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    response.status(error.status ?? 500).send('Can Not Create User.');
  }
};
