/* eslint-disable @typescript-eslint/no-explicit-any */

import { Role } from '@prisma/client';
import { deleteUser, findUserByEmail } from '../api/user/service';
import * as jwt from 'jsonwebtoken';

const testUser = {
  email: 'testUser@gmail.com',
  password: 'testPassword123',
  role: Role.OWNER
};

const createOptions = (method: 'POST' | 'GET' | 'PATCH', body?: object) => {
  return body
    ? {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    : {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
};

const createURL = (route: string) => {
  return `http://127.0.0.1:3000${route}`;
};

const createTestUser = async () => {
  const url = createURL('/user/create');
  const postData = testUser;
  const response = await fetch(url, createOptions('POST', postData));
  const data = (await response.json()) as any;
  expect(response.status).toBe(201);
  expect(data.userKey).toBeDefined();
  return data.userKey;
};

describe('User API Ops Tests', () => {
  afterEach(async () => {
    if (await findUserByEmail(testUser.email)) {
      await deleteUser(testUser.email);
    }
  });

  //create user tests
  it('Test Run Create User. User Should Be Created', async () => {
    await createTestUser();
  });
  it('Test Run Create User No Password. Should Return 422', async () => {
    const url = createURL('/user/create');
    const badUser = { email: testUser.email, role: Role.OWNER };
    const response = await fetch(url, createOptions('POST', badUser));
    expect(response.status).toBe(422);
  });
  it('Test Run Create User No Email. Should Return 422', async () => {
    const url = createURL('/user/create');
    const badUser = { password: testUser.password, role: Role.OWNER };
    const response = await fetch(url, createOptions('POST', badUser));
    expect(response.status).toBe(422);
  });
  it('Test Run Create User Bad Email. Should Return 422', async () => {
    const url = createURL('/user/create');
    const badUser = {
      password: testUser.password,
      email: 'badEmail',
      role: Role.OWNER
    };
    const response = await fetch(url, createOptions('POST', badUser));
    expect(response.status).toBe(422);
  });
  it('Test Run Create User Bad Role. Should Return 422', async () => {
    const url = createURL('/user/create');
    const badUser = {
      password: testUser.password,
      email: testUser.email,
      role: 'badRole'
    };
    const response = await fetch(url, createOptions('POST', badUser));
    expect(response.status).toBe(422);
  });
  it('Test Run Create User No Role. Should Return 422', async () => {
    const url = createURL('/user/create');
    const badUser = { password: testUser.password, email: testUser.email };
    const response = await fetch(url, createOptions('POST', badUser));
    expect(response.status).toBe(422);
  });

  //login test
  it('Test User Login. User Should Be Able To Login', async () => {
    const userKey = await createTestUser();
    const verifyAccountUrl = createURL(`/user/verify/${userKey}`);
    await fetch(verifyAccountUrl, { redirect: 'manual' });
    const url = createURL('/user/login');
    const response = await fetch(url, createOptions('POST', testUser));
    const data = (await response.json()) as any;
    expect(response.status).toBe(200);
    expect(data.accessToken).toBeDefined();
    const tokenInfo = jwt.decode(data.accessToken) as any;
    expect(tokenInfo.email).toBe(testUser.email);
  });
  it('Test User Login No Verified Email. User Should Not Be Able To Login.', async () => {
    await createTestUser();
    const url = createURL('/user/login');
    const response = await fetch(url, createOptions('POST', testUser));
    const data = (await response.json()) as any;
    expect(response.status).toBe(401);
    expect(data.message).toBe(
      `Please Validate Email, Check Your Email For Verification Email`
    );
  });
  it('Test User Login Incorrect Password. User Should Not Be Able To Login', async () => {
    const userKey = await createTestUser();
    const verifyAccountUrl = createURL(`/user/verify/${userKey}`);
    await fetch(verifyAccountUrl, { redirect: 'manual' });
    const url = createURL('/user/login');
    const badUser = {
      email: testUser.email,
      password: 'Bad Password'
    };
    const response = await fetch(url, createOptions('POST', badUser));
    const data = (await response.json()) as any;
    expect(response.status).toBe(401);
    expect(data.message).toBe(`Invalid Email or Password`);
  });
  // update password
  it('Test User Update Password. User Should Be Able To Update Password', async () => {
    const userKey = await createTestUser();
    const verifyAccountUrl = createURL(`/user/verify/${userKey}`);
    await fetch(verifyAccountUrl, { redirect: 'manual' });
    const resetPasswordEmailUrl = createURL(
      `/user/reset_password/${testUser.email}`
    );
    await fetch(resetPasswordEmailUrl);
    const resetPasswordUrl = createURL(`/user/password_reset`);
    const userWithNewPassword = {
      email: testUser.email,
      newPassword: 'newPassword123'
    };
    const response = await fetch(
      resetPasswordUrl,
      createOptions('PATCH', userWithNewPassword)
    );
    expect(response.status).toBe(200);
    const url = createURL('/user/login');
    const responseLogin = await fetch(
      url,
      createOptions('POST', {
        email: testUser.email,
        password: userWithNewPassword.newPassword
      })
    );
    const data = (await responseLogin.json()) as any;
    expect(responseLogin.status).toBe(200);
    expect(data.accessToken).toBeDefined();
    const tokenInfo = jwt.decode(data.accessToken) as any;
    expect(tokenInfo).toBeDefined();
  });
  it('Test User Update Password Bad Email. User Should Not Be Able To Update Password', async () => {
    const userKey = await createTestUser();
    const verifyAccountUrl = createURL(`/user/verify/${userKey}`);
    await fetch(verifyAccountUrl, { redirect: 'manual' });
    const resetPasswordEmailUrl = createURL(
      `/user/reset_password/${testUser.email}`
    );
    await fetch(resetPasswordEmailUrl);
    const resetPasswordUrl = createURL(`/user/password_reset`);
    const userWithNewPassword = {
      email: 'badEmail@gmail.com',
      newPassword: 'newPassword123'
    };
    const response = await fetch(
      resetPasswordUrl,
      createOptions('PATCH', userWithNewPassword)
    );
    expect(response.status).toBe(401);
    const data = (await response.json()) as any;
    expect(data.message).toBe(`Invalid Email`);
  });
  it('Test User Update Password Bad Email. User Should Not Be Able To Update Password', async () => {
    const userKey = await createTestUser();
    const verifyAccountUrl = createURL(`/user/verify/${userKey}`);
    await fetch(verifyAccountUrl, { redirect: 'manual' });
    const resetPasswordEmailUrl = createURL(
      `/user/reset_password/${testUser.email}`
    );
    await fetch(resetPasswordEmailUrl);
    const resetPasswordUrl = createURL(`/user/password_reset`);
    const userWithNewPassword = {
      email: 'badEmail@gmail.com',
      newPassword: 'newPassword123'
    };
    const response = await fetch(
      resetPasswordUrl,
      createOptions('PATCH', userWithNewPassword)
    );
    expect(response.status).toBe(401);
    const data = (await response.json()) as any;
    expect(data.message).toBe(`Invalid Email`);
  });
});
