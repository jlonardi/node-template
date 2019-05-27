const express = require('express');
const passport = require('passport');
const util = require('util');
const querystring = require('querystring');
const { createUserIfNeeded } = require('./auth.service');

const router = express.Router();

router.get(
  '/login',
  passport.authenticate('auth0', {
    scope: 'openid email profile'
  }),
  (req, res) => {
    res.redirect('/');
  }
);

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', (req, res, next) => {
  passport.authenticate('auth0', (err, user) => {
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
      await createUserIfNeeded(user.id);
      const { session } = req;
      const { returnTo } = session;
      delete req.session.returnTo;
      res.redirect(returnTo || '/');
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

  res.redirect(logoutURL);
});

module.exports = router;
