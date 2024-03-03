export interface UserCreation {
  email: string;
  role: 'CLERK' | 'OWNER' | 'MOBILE';
  password: string;
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
