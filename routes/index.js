const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Class = require('../models/Class');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { checkAuthenticated } = require('../middleware.js');

// Home Page - GET /
router.get('/', (req, res) => {
  res.render('home', { title: 'LMS - Home', script: './home.js', home: true });
});

// Home Page - login - POST /
router.post('/', (req, res, next) => {
  passport.authenticate('local', function(err, user, info, status) {
    if (err) { return next(err) }
    if (!user) { return res.json({ success: false, ...info }) }
    req.login(user, (err) => {
      if (err) { return next(err) };
      res.json({ success: true, redirectUrl: '/dashboard' });
    })
  })(req, res, next);
});

// Home Page - Register - POST /register
router.post('/register', async (req, res, next) => {
  const { username, firstname, lastname, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ username, password: hashedPassword, firstname, lastname });
    req.flash('success', 'Successfully Registered');
    res.redirect('/');

    // let errors = [];
    // if (!username || !firstname || !password || !password2) {
    //   errors.push('Please fill all fields');
    // }
    // if (password !== password2) {
    //   errors.push('Passwords does not match');
    // }
    // const userName = await User.findOne({ username: username });
    // if (userName) {
    //   errors.push('Username is already taken');
    // }
    // if (errors.length > 0) {
    //   res.render('home', { title: 'LMS - Home', errors })
    // } else {
    //   const salt = await bcrypt.genSalt(10);
    //   const hashedPassword = await bcrypt.hash(password, salt);
    //   const newUser = await User.create({ username, password: hashedPassword, firstname, lastname });
    //   req.flash('success', 'Successfully Registered');
    //   res.redirect('/');
    // }
  } catch (err) { next(err) }
});

// Dashboard Page - GET /dashboard
// router.get('/dashboard', checkAuthenticated, async (req, res, next) => {
router.get('/dashboard', async (req, res, next) => {
  try {
    // if (req.user.isBasic) {
    //   const user = await User.findById({ _id: req.user._id });
    //   res.render('notverified', { user });
    // }
    
    if (req.user.role === "admin") {
      const usersArr = await User.find({}).lean();
      const users = usersArr.filter(user => user.username !== "admin" && user.role !== "admin").filter(user => user.username !== "student");
      const user = await User.findById({ _id: req.user._id });

    res.render('admin/dashboard', { 
      title: 'Dashboard - Admin', 
      script: "./admin/dashboard.js", 
      users, 
      user
    });

    } else {
      const user = await User.findById(req.user._id).lean();
      
      res.render('student/dashboard', { 
        title: 'Dashboard - Student', 
        user,
        isStudent: user.role === 'student'
      })
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
