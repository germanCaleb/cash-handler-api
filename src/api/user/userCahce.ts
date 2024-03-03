import { User } from '@prisma/client';

export type registrationKey = string;

export abstract class UserCache {
  private static userCache: Map<registrationKey, User> = new Map();
  private static timeout = 3600000; // this is 1 hour in milliseconds

  private static clearCache = () => {
    this.userCache.clear();
  };

  private static intervalId = setInterval(
    UserCache.clearCache,
    UserCache.timeout
  );

  public static addUser(registrationKey: registrationKey, user: User) {
    this.userCache.set(registrationKey, user);
  }

  public static getUser(registrationKey: registrationKey) {
    return this.userCache.get(registrationKey);
  }
}
