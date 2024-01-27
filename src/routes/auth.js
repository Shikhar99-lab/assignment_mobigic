const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

router.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error registering user.' });
    }
    passport.authenticate('local')(req, res, () => {
      res.json({ success: true, message: 'User registered successfully.' });
    });
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ success: true, message: 'User logged in successfully.' });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json({ success: true, message: 'User logged out successfully.' });
});

module.exports = router;
