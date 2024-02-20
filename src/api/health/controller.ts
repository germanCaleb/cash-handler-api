import { Request, Response } from 'express';
export const healthHandler = (_request: Request, response: Response) => {
  response.status(200).send();
};
