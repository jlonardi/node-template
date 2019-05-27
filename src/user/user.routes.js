const express = require('express');
const service = require('./user.services');

const router = express.Router();

const requiresAuthentication = (req, res, next) => (req.user ? next() : res.redirect('/login'));

const requiresUsername = async (req, res, next) => {
  const username = req.user && (await service.getUsername(req.user.id));
  return username ? next() : res.redirect('/username');
};

router.use(requiresAuthentication);

router.get('/username', (req, res) => res.render('username', { user: req.user.id }));

router.get('/chat', requiresUsername, (req, res) => res.render('chat'));

router.post('/messages', requiresAuthentication, async (req, res) =>
  (await service.sendMessage(req.user.id, req.body.message))
    ? res.sendStatus(201)
    : res.sendStatus(500)
);

router.post('/username', requiresAuthentication, (req, res, next) =>
  service.setUsername(req.user.id, req.body.username) ? res.redirect('/chat') : next()
);

router.get('/messages', requiresAuthentication, async (req, res) => {
  try {
    const messages = await service.getMessages();
    res.json(messages);
  } catch (e) {
    res.sendStatus(500);
  }
});

module.exports = router;
