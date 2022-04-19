const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Dashboard Page - Updates single user - PUT /users/:id
router.put('/:id', async (req, res, next) => {
  const { email, username, role } = req.body;
  try {
    const foundUser = await User.findById({ _id: req.params.id });
    if (!foundUser) {
      req.flash('error', 'No user found');
      res.status(404).redirect('/dashboard');
    }

    const user = await User.findByIdAndUpdate({ _id: req.params.id }, {
      email, username, isBasic: role !== 'basic' ? false : true, isStudent: role !== 'student' ? false : true, isAdmin: role !== 'admin' ? false : true,
      isTeacher: role !== 'teacher' ? false : true
    });
    req.flash('success', 'Update successfully!');
    res.status(200).redirect('/dashboard');
  } catch (err) { next(err) }
});

// Dashboard Page - Deletes single user - DELETE /users/:id
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete({ _id: req.params.id });
    req.flash('success', 'User has been deleted!')
    res.status(200).redirect('/dashboard')
  } catch (err) { next(err) }
});

module.exports = router;
