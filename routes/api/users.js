const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { checkAuthenticated } = require('../../middleware');

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

// Gets single user - GET /api/users/:id
// router.get('/:id', checkAuthenticated, async (req, res, next) => {
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    res.status(200).json(user);
  } catch (err) { next(err) }
});

// Updates users quiz score - PUT /api/users/:id
router.put('/:id', async (req, res, next) => {
  try {
    // console.log(req.params.id)
    console.log(req.body)
    // const { chapterId, score } = req.body;
    // await User.findByIdAndUpdate({ _id: req.params.id }, {
    //   $push: { quizzes: {
    //     chapter: chapterId,
    //     score: score
    //   } }
    // })
  } catch (err) { console.log(err.message) }
});

// // DELETE /api/users/:id
// router.delete('/:id', async (req, res, next) => {
//   try {
//     await User.findByIdAndDelete({ _id: req.params.id });
//     res.json({ msg: "User has been deleted" });
//   } catch (err) { next(err) }
// });

module.exports = router;
