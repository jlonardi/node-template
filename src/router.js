const express = require('express');
const authRoutes = require('./auth/auth.routes');
const userRoutes = require('./user/user.routes');
const publicRoutes = require('./public/public.routes');

const router = express.Router();

const userInViews = (req, res, next) => {
  res.locals.user = req.user;
  next();
};

router.use(userInViews);

router.use(express.static('public'));
router.use(authRoutes);
router.use(publicRoutes);
router.use(userRoutes);

module.exports = router;
