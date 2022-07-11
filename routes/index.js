const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Class= require('../models/Class');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { checkAuthenticated } = require('../middleware.js');

// Home Page - GET /
router.get('/', (req, res) => {
  res.render('home', { title: 'LMS - Home' });
});

// Home Page - login - POST /
router.post('/', (req, res, next) => {
  passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/', failureFlash: true, successFlash: true })(req, res, next);
});

// Home Page - Register - POST /register
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
      res.render('home', { title: 'LMS - Home', errors })
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await User.create({ email, username, password: hashedPassword, firstname, lastname });
      req.flash('success', 'Successfully Registered');
      res.redirect('/');
    }
  } catch (err) { next(err) }
});

// Dashboard Page - GET /dashboard
router.get('/dashboard', checkAuthenticated, async (req, res, next) => {
  try {
    if (req.user.isBasic) {
      const user = await User.findById({ _id: req.user._id });
      res.render('notverified', { user });
    }
    if (req.user.isAdmin) {
      const users = await User.find({}).lean();
      users.forEach((user) => {
        user.fetchUrl = process.env.NODE_ENV == 'development' ? `http://localhost:${process.env.PORT}` : `https://lmslbrn.herokuapp.com`;
      });

      const user = await User.findById({ _id: req.user._id });
      res.render('admin/dashboard', { title: 'Dashboard - Admin', users, admin: true, user });
    }

    if (req.user.isStudent) {
      const user = await User.findById({ _id: req.user._id });
      res.render('student/dashboard', { title: 'Dashboard - Student', user });
    }

  } catch (err) { next(err) }
})

// Home Page - Logout - GET /logout to /
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged Out');
  res.redirect('/');
});

module.exports = router;
