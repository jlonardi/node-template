import path from 'path';
import express, { RequestHandler } from 'express';
import { authRoutes } from './auth/auth.routes';
import { userRoutes } from './user/user.routes';
import { publicRoutes } from './public/public.routes';

const router = express.Router();

const userInViews: RequestHandler = (req, res, next) => {
  res.locals.user = req.user;
  next();
};

router.use(userInViews);

router.use(express.static(path.join(__dirname, 'static')));
router.use(authRoutes);
router.use(publicRoutes);
router.use(userRoutes);

export const appRoutes = router;
