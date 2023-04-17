const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { checkAuthenticated } = require('../middleware');

router.route("/:id")
  // GET /api/users/:id - Gets single user
  .get(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (err) { next(err) }
  })
  // PUT /api/users/:id - Updates single user
  .put(async (req, res, next) => {
    try {
      const updUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updUser)
    } catch (err) { next(err) }
  })
  // DELETE /api/users/:id - Deletes single user
  .delete(async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.params.id);
    } catch (err) { next(err) }
  })

// Gets all users - GET /api/users
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
    const students = usersArr.filter(user => user.role === "student");
    res.status(200).json(students);
  } catch (err) { next(err) }
});

module.exports = router;
