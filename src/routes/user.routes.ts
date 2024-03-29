import express, { RequestHandler } from 'express';
import * as service from '../services/user.services';
import { requiresAuthentication } from './middlewares';

const router = express.Router();

const requiresUsername: RequestHandler = async (req, res, next) => {
  const username = req.user && (await service.getUsername(req.user.id));
  return username ? next() : res.redirect('/username');
};

router.use(requiresAuthentication);

router.get('/username', (_req, res) => res.render('username'));

router.get('/chat', requiresUsername, (_req, res) => res.render('chat'));

router.post('/messages', async (req, res) => {
  const messages = await service.sendMessage(req.user.id, req.body.message);
  res.json(messages);
});

router.post('/username', async (req, res, next) =>
  (await service.setUsername(req.user.id, req.body.username)) ? res.redirect('/chat') : next()
);

router.get('/messages', async (req, res) => {
  const messages = await service.getMessages(req.user);
  res.json(messages);
});

export const userRoutes = router;
