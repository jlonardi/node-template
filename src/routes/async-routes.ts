import { RequestHandler } from 'express';
import { PromiseRejectionError } from '../errors/promise-rejection-error';

export const asyncRoute = (callback: RequestHandler) => async (req: any, res: any, next: any) => {
  try {
    await callback(req, res, next);
  } catch (error) {
    next(new PromiseRejectionError(error));
  }
};
