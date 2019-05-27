require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const router = require('./src/router');

const logger = require('./src/utils/logger');
const morganLogFormatter = require('./src/utils/formatter');

const app = express();
const port = process.env.PORT || 3000;

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
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

const sess = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge
  },
  store: new PgSession({
    conString: process.env.DATABASE_URL,
    pruneSessionInterval: 60
  })
};

if (app.get('env') === 'production') {
  sess.proxy = true; // Heroku terminates SSL before it reaches the server https://stackoverflow.com/questions/14463972/how-to-set-secure-cookie-using-heroku-node-js-express/14473557
  sess.cookie.secure = true; // serve secure cookies, requires https
}

app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());

// View engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

app.use(router);

app.listen(port, () => logger.info(`App listening on port ${port}!`));

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error(`Not Found: ${req.url}`);
  err.status = 404;
  next(err);
});

// Will print stacktrace in development
const errorMessage = err => (app.get('env') === 'development' ? err.message : '');

// Error handlers
app.use((err, req, res, next) => {
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
    message: errorMessage(err),
    error: err
  });
});
