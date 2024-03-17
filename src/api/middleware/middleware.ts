import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HttpError } from '../common/models';
import { getAppSettings } from '../../services/app.settings/app.settings.service';
import { scopes as UserScopes } from '../user/models';
export type SchemaVerifier = (obj: object) => boolean;

export const verifyPayloadSchema = (schemaVerifier: SchemaVerifier) => {
  return (request: Request, response: Response, nextFunction: NextFunction) => {
    if (request.body && schemaVerifier(request.body)) {
      nextFunction();
      return;
    }
    response.status(422).send();
  };
};

export const verifyUserJwtToken = (scopes?: UserScopes[]) => {
  return (request: Request, response: Response, nextFunction: NextFunction) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) throw Error('No auth header provided.');
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(
        token,
        getAppSettings().JWT_SIGN_SECRET
      ) as JwtPayload;
      if (decoded.iss === 'omi-swipe') throw Error('Invalid Issuer.');
      if (scopes && scopes.length > 0) {
        if (!Object.prototype.hasOwnProperty.call(decoded, 'scopes')) {
          throw new Error('Scopes not provided');
        }
        const scopeSet = new Set<string>();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const jwtScopes = (decoded as any).scopes as string[];
        if (!jwtScopes || jwtScopes.length === 0)
          throw new Error('No scopes provided.');

        jwtScopes.forEach((scope) => {
          scopeSet.add(scope);
        });
        scopes.forEach((scope) => {
          if (!scopeSet.has(scope)) throw new Error('Scope is not valid.');
        });
      }
      nextFunction();
    } catch (err) {
      const httpError = err as HttpError;
      return response
        .status(httpError.status ?? 403)
        .send(`Token verification failed: ${httpError.message}`);
    }
  };
};
