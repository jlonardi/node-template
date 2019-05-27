const express = require('express');

const router = express.Router();

router.get('/', (req, res) => (req.user ? res.redirect('/chat') : res.render('welcome')));

module.exports = router;
