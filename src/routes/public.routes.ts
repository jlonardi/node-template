import express from 'express';

const router = express.Router();

router.get('/', (req, res) => (req.user ? res.redirect('/chat') : res.render('welcome')));

export const publicRoutes = router;
