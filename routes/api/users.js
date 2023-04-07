const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { checkAuthenticated } = require('../../middleware');

// Gets single user - GET /api/users/:id
// router.get('/:id', checkAuthenticated, async (req, res, next) => {
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    res.status(200).json(user);
  } catch (err) { next(err) }
});

// PUT /api/users/:id - Updates single user
router.put('/:id', async (req, res, next) => {
  try {
    const updUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updUser)
  } catch (err) { next(err) }
});

// // DELETE /api/users/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const delUser = await User.findByIdAndDelete(req.params.id );
    res.json(delUser);
  } catch (err) { next(err) }
});

// Gets all users - GET /api/users
// router.get('/', checkAuthenticated, async (req, res, next) => {
router.get('/', async (req, res, next) => {
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

module.exports = router;
