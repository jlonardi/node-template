import express from 'express';
import passport from 'passport';
import util from 'util';
import querystring from 'querystring';
import { createUserIfNeeded } from './auth.service';

export interface IAuthUser {
  picture?: string;
  id: string;
}

const router = express.Router();

router.get(
  '/login',
  passport.authenticate('auth0', {
    scope: 'openid email profile'
  }),
  (_req, res) => {
    res.redirect('/');
  }
);

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', (req, res, next) => {
  passport.authenticate('auth0', (err, user: IAuthUser) => {
    if (err) {
      next(err);
      return;
    }
    if (!user) {
      res.redirect('/login');
      return;
    }
    req.logIn(user, async loginErr => {
      if (loginErr) {
        next(loginErr);
        return;
      }
      const created = await createUserIfNeeded(user);
      if (created) {
        res.redirect('/username');
        return;
      }
      res.redirect('/');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();

  const production = process.env.NODE_ENV === 'production';
  const returnTo = `${production ? 'https' : 'http'}://${req.get('host')}`;
  const logoutURL = new URL(util.format('https://%s/logout', process.env.AUTH0_DOMAIN));
  const searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL.href);
});

export const authRoutes = router;
