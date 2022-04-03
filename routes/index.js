const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Home Route
router.get('/', (req, res) => {
  res.render('home', {
    title: 'ICCT LMS - Home'
  });
});

router.post('/register', async (req, res, next) => {
  const { email, username, firstname, lastname, password, password2, check } = req.body;
  try {
    let errors = [];
    if (!email || !username || !firstname || !password || !password2 || !check) {
      errors.push('Please fill all fields');
    }
    if (password !== password2) {
      errors.push('Passwords does not match');
    }
    if (password.length < 5) {
      errors.push('Password atleast 5 characters');
    }
    const userEmail = await User.findOne({ email: email });
    if (userEmail) {
      errors.push('Email already registered');
    }
    const userName = await User.findOne({ username: username });
    if (userName) {
      errors.push('Username is already taken');
    }
    if (errors.length > 0) {
      console.log(errors)
      res.render('home', {
        title: 'ICCT LMS - Home',
        errors
      })
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await User.create({
        email, username, password: hashedPassword, firstname, lastname
      });
      req.flash('success', 'Successfully Registered');
      res.redirect('/');
    }
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
