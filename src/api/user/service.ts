import { createHashedPasswordAndSalt } from '../../services/password/hash';
import { UserCreation } from './models';
import prisma from '../../services/prisma/prisma';
import { sendVerificationEmail } from '../../services/email/email';
import { UserCache } from './userCahce';
import { randomUUID } from 'crypto';

export const createUser = async (input: UserCreation) => {
  const { salt, hash } = createHashedPasswordAndSalt(input.password);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hash,
      salt: salt,
      role: input.role
    }
  });
  const userKey = randomUUID();
  if (user) sendVerificationEmail(user.email, userKey);
  UserCache.addUser(userKey, user);
  return { ...user, userKey };
};
