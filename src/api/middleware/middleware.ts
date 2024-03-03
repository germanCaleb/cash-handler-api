import { Request, Response, NextFunction } from 'express';

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
