import { RequestHandler } from 'express';

export const requiresAuthentication: RequestHandler = (req, res, next) =>
  req.user ? next() : res.redirect('/landing');
