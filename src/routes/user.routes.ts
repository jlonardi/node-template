import express, { RequestHandler } from 'express';
import * as service from '../services/user.services';

const router = express.Router();

const requiresAuthentication: RequestHandler = (req, res, next) =>
  req.user ? next() : res.redirect('/login');

const requiresUsername: RequestHandler = async (req, res, next) => {
  try {
    const username = req.user && (await service.getUsername(req.user.id));
    return username ? next() : res.redirect('/username');
  } catch (e) {
    return next(e);
  }
};

router.use(requiresAuthentication);

router.get('/username', (_req, res) => res.render('username'));

router.get('/chat', requiresUsername, (_req, res) => res.render('chat'));

router.post('/messages', requiresAuthentication, async (req, res, next) => {
  try {
    const messages = await service.sendMessage(req.user.id, req.body.message);
    res.json(messages);
  } catch (e) {
    next(e);
  }
});

router.post('/username', requiresAuthentication, (req, res, next) =>
  service.setUsername(req.user.id, req.body.username) ? res.redirect('/chat') : next()
);

router.get('/messages', requiresAuthentication, async (req, res, next) => {
  try {
    const messages = await service.getMessages(req.user);
    res.json(messages);
  } catch (e) {
    next(e);
  }
});

export const userRoutes = router;
