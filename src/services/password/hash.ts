import crypto from 'crypto';

// this is for learning use another lib for hashing
export const createHashedPasswordAndSalt = (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return { hash, salt };
};

export const hashPassword = (password: string, salt: string) => {
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return hash;
};

export const verifyPassword = (
  candidatePassword: string,
  salt: string,
  hash: string
) => {
  const candidateHash = crypto
    .pbkdf2Sync(candidatePassword, salt, 1000, 64, 'sha512')
    .toString('hex');
  return candidateHash === hash;
};
