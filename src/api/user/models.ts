export interface UserCreation {
  email: string;
  role: 'CLERK' | 'OWNER' | 'MOBILE';
  password: string;
}

export enum scopes {
  runTransaction = 'runTransaction',
  createProductsSchema = 'createProductsSchema',
  mobile = 'mobile'
}

export interface UserPasswordReset {
  email: string;
  newPassword: string;
}

export interface UserLogin {
  password: string;
  email: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isUserCreation(obj: object): obj is UserCreation {
  const isUserCreation =
    'email' in obj &&
    'role' in obj &&
    'password' in obj &&
    typeof obj.email === 'string' &&
    typeof obj.password === 'string' &&
    (obj.role === 'CLERK' || obj.role === 'OWNER' || obj.role === 'MOBILE');
  return isUserCreation && emailRegex.test(obj.email as string);
}

export function isUserPasswordReset(obj: object): obj is UserPasswordReset {
  const isUserPasswordReset =
    'email' in obj &&
    'newPassword' in obj &&
    typeof obj.email === 'string' &&
    typeof obj.newPassword === 'string';
  return isUserPasswordReset && emailRegex.test(obj.email as string);
}

export function isUserLogin(obj: object): obj is UserLogin {
  const isUserPasswordReset =
    'email' in obj &&
    'password' in obj &&
    typeof obj.email === 'string' &&
    typeof obj.password === 'string';
  return isUserPasswordReset && emailRegex.test(obj.email as string);
}
