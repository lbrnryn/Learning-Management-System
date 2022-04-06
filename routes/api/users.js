const express = require('express');
const router = express.Router();
const User = require('../../models/User');

router.get('/', async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// Get single user /api/users/
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// Update single user /api/users/:id
router.put('/:id', async (req, res, next) => {
  const { email, username, role } = req.body;
  try {
    // if (!email || !username || !role) {
    //   // res.status(400).json({ success: false, message: 'Please fill all fields' });
    //   req.flash('error', 'Please fill all fields');
    //   req.status(400).redirect('/dashboard');
    // }
    const foundUser = await User.findById({ _id: req.params.id });
    if (!foundUser) {
      // res.status(404).json({ success: false, message: 'No user found' });
      req.flash('error', 'No user found');
      res.status(404).redirect('/dashboard');
    }

    const user = await User.findByIdAndUpdate({ _id: req.params.id }, {
      email: email,
      username: username,
      isBasic: role !== 'basic' ? false : true,
      isStudent: role !== 'student' ? false : true,
      isAdmin: role !== 'admin' ? false : true,
      isTeacher: role !== 'teacher' ? false : true
    });
    req.flash('success', 'Update successfully!');
    res.status(200).redirect('/dashboard');
  } catch (err) {
    next(err);
  }
});

// Delete single user /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete({ _id: req.params.id });
    // res.status(200).json({ success: true, message: 'User has been removed' })
    req.flash('success', 'User has been deleted!')
    res.status(200).redirect('/dashboard')
  } catch (err) {
    next(err);
  }
})
module.exports = router;
