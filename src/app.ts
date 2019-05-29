import dotenv from 'dotenv';
dotenv.config();

import bodyParser from 'body-parser';
import express, { Response, NextFunction } from 'express';
import session, { SessionOptions } from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import morgan from 'morgan';
import path from 'path';
import passport from 'passport';
import * as passportAuth0Srategy from 'passport-auth0';
import { NotFoundError } from './errors/not-found-error';
import { appRoutes } from './router';
import { logger } from './utils/logger';
import { morganLogFormatter } from './utils/formatter';
import { IAppError } from './types/errors';

const pgSession = connectPgSimple(session);
const auth0Strategy = passportAuth0Srategy.Strategy;

const app = express();
const port = process.env.PORT || 3000;

// Configure Passport to use Auth0
const strategy = new auth0Strategy(
  {
    callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
    clientID: process.env.AUTH0_CLIENT_ID || 'bar',
    clientSecret: process.env.AUTH0_CLIENT_SECRET || 'baz',
    domain: process.env.AUTH0_DOMAIN || 'foo'
  },
  (_accessToken, _refreshToken, _extraParams, profile, done) => {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);

app.use(morgan(morganLogFormatter));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const maxAge = 7 * 24 * 60 * 60 * 1000;

const sess: SessionOptions = {
  cookie: {
    maxAge,
    secure: false
  },
  proxy: false,
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET || 'foo',
  store: new pgSession({
    conString: process.env.DATABASE_URL,
    pruneSessionInterval: 60
  })
};

if (app.get('env') === 'production') {
  sess.proxy = true; // Heroku terminates SSL before it reaches the server https://stackoverflow.com/questions/14463972/how-to-set-secure-cookie-using-heroku-node-js-express/14473557
  if (sess.cookie) {
    sess.cookie.secure = true; // serve secure cookies, requires https
  }
}

app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(appRoutes);

app.listen(port, () => logger.info(`App listening on port ${port}!`));

// Catch 404 and forward to error handler
app.use((req, _res, next) => {
  const err = new NotFoundError(`Not Found: ${req.url}`);
  next(err);
});

// Will print stacktrace in development
const errorMessage = (err: IAppError) => (app.get('env') === 'development' ? err.message : '');

// Error handlers
app.use((err: IAppError, _req: any, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  logger.error(err);

  if (err.status === 404) {
    res.render('404');
    return;
  }

  res.status(err.status || 500);
  res.render('error', {
    error: err,
    message: errorMessage(err)
  });
});
