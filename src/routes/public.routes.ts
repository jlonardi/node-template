import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => res.redirect('/chat'));

router.get('/landing', (_req, res) => res.render('welcome'));

export const publicRoutes = router;
