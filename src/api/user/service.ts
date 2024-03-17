import jwt from 'jsonwebtoken';
import {
  createHashedPasswordAndSalt,
  hashPassword,
  verifyPassword
} from '../../services/password/hash';
import { UserCreation, scopes } from './models';
import prisma from '../../services/prisma/prisma';
import { sendVerificationEmail } from '../../services/email/email';
import { UserCache } from './userCahce';
import { randomUUID } from 'crypto';
import { User } from '@prisma/client';
import { getAppSettings } from '../../services/app.settings/app.settings.service';

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

export const verifyUser = async (userKey: string) => {
  // todo make a fall back possibly resend verification email ?
  const user = UserCache.getUser(userKey);
  if (!user) throw new Error('User not found');
  const email = user.email;
  const updateUser = await prisma.user.update({
    where: {
      email
    },
    data: {
      verifiedEmail: true
    }
  });
  return updateUser;
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email
    }
  });
};

export const updatePassword = async (
  newPassword: string,
  email: string,
  salt: string
) => {
  const newHashedPassword = hashPassword(newPassword, salt);
  await prisma.user.update({
    where: {
      email
    },
    data: {
      password: newHashedPassword
    }
  });
};

export const verifyUserPassword = async (
  candidatePassword: string,
  user: {
    id: string;
    email: string;
    password: string;
    salt: string;
  }
) => {
  return verifyPassword(candidatePassword, user.salt, user.password);
};

export const createAndSignUserToken = (user: User) => {
  const expiresIn = 30 * 60; // expires in 30 min

  return jwt.sign(
    {
      email: user.email,
      scope: getScopesFromUser(user)
    },
    getAppSettings().JWT_SIGN_SECRET,
    { expiresIn: expiresIn, issuer: getAppSettings().ISSUER }
  );
};

const getScopesFromUser = (user: User) => {
  switch (user.role) {
    case 'CLERK':
      return [scopes.runTransaction];
    case 'OWNER':
      return [scopes.createProductsSchema, scopes.runTransaction];
    case 'MOBILE':
      return [scopes.runTransaction, scopes.mobile];
  }
};

export const deleteUser = async (email: string) => {
  await prisma.user.delete({
    where: {
      email
    }
  });
};
