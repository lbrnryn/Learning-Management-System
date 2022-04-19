const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { checkAuthenticated } = require('../../middleware');

// Gets all users - GET /api/users
router.get('/', checkAuthenticated, async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) { next(err) }
});

// Gets all students - GET /api/users/students
router.get('/students', async (req, res, next) => {
  try {
    const usersArr = await User.find({});
    const students = usersArr.filter(user => user.isStudent == true);
    res.status(200).json(students);
  } catch (err) { next(err) }
});

// Gets single user - GET /api/users/:id
router.get('/:id', checkAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    res.status(200).json(user);
  } catch (err) { next(err) }
});

module.exports = router;
