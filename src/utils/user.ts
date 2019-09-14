import { Request } from 'express';

export const getUserFromSession = (req: Request) =>
  req.session ? req.session.passport.user : undefined;
