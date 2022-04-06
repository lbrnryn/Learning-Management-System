const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Home Route
router.get('/', (req, res) => {
  res.render('home', {
    title: 'ICCT LMS - Home'
  });
});

router.post('/', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true,
    successFlash: true
  })(req, res, next);
})

// Register Route
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

// Dashboard Route
router.get('/dashboard', async (req, res, next) => {
  const usersArr = await User.find({});
  const users = usersArr.map((user) => {
    const { _id, email, username, isBasic, isStudent, isAdmin, isTeacher } = user;
    const fetchUrl = process.env.NODE_ENV == 'development' ? `http://localhost:1000/api/users/${_id}` : `https://icctlms.herokuapp.com/api/users/${_id}`
    return {
      _id, email, username, isBasic, isStudent, isAdmin, isTeacher, fetchUrl
    }
  })
  // console.log(users)
  res.render('dashboard/admin', {
    title: 'Dashboard - Admin',
    users
  });
})

// Logout Route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged Out');
  res.redirect('/');
});

module.exports = router;
