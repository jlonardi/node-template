import express from 'express';
import passport from 'passport';
import util from 'util';
import querystring from 'querystring';
import { createUserIfNeeded } from '../services/auth.service';

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

// Perform the final stage of authentication and redirect to previously requested URL or '/username'
router.get(
  '/callback',
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  async (req, res) => {
    const created = await createUserIfNeeded(req.user);
    if (created) {
      res.redirect('/username');
      return;
    }
    res.redirect('/');
  }
);

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
