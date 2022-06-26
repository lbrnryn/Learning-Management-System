const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Chapter = require('../models/Chapter');
const Question = require('../models/Question');

// Get quiz questions of single chapter - GET /questions/quiz/chapter/:id
router.get('/quiz/chapter/:id', async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      const chapter = await Chapter.findById({ _id: req.params.id });
      const quizQuestions = await Question.find({ chapter: req.params.id, type: "quiz" });
      const user = await User.findById({ _id: req.user._id });
      // console.log(chapter)
      // console.log(quizQuestions)
      res.render('admin/quiz', { quizQuestions, chapter, admin: true, user });
    }

    if (req.user.isStudent) {
      const quizQuestions = await Question.find({ chapter: req.params.id, type: "quiz" });
      const chapter = await Chapter.findById({ _id: req.params.id }).lean();
      // const user = await User.findById({ _id: req.user._id }).populate('chapter');
      const user = await User.findById({ _id: req.user._id });
      // console.log(user)
      // console.log(req.params.id)
      // user.quizzes.forEach((quiz) => {
      //   console.log(quiz.chapter)
      //   // if (quiz.chapter === req.params.id) {
      //   //   console.log('match')
      //   //   // return chapter.isTaken = true, chapter.score = quiz.score
      //   //   // console.log(chapter)
      //   // }
      //   // console.log(quiz)
      // });

      res.render('student/quiz', { chapter, quizQuestions, userId: req.user._id,
        url1: process.env.NODE_ENV == "development" ? `http://localhost:2000/api/questions/quiz/chapter/${chapter._id}` : `https://lmslbrn.herokuapp.com/api/questions/quiz/chapter/${chapter._id}`,
        url2: process.env.NODE_ENV == "development" ? `http://localhost:2000/users/quizzes` : `https://lmslbrn.herokuapp.com/users/quizzes`,
        url3: process.env.NODE_ENV == "development" ? `http://localhost:2000/classes` : `https://lmslbrn.herokuapp.com/classes` })
    }
  } catch (err) { next(err) }
});

// Creates quiz questions of single chapter - POST /questions/quiz/chapter/:id
router.post('/quiz/chapter/:id', async (req, res, next) => {
  try {
    const { title, question, order, value, answer } = req.body;
    const quizQuestion = await Question.create({
      type: "quiz",
      chapter: req.params.id,
      title: title, question: question,
      choices: [
        { title: title, order: `${title.toLowerCase()}${order[0]}`, value: value[0] },
        { title: title, order: `${title.toLowerCase()}${order[1]}`, value: value[1] },
        { title: title, order: `${title.toLowerCase()}${order[2]}`, value: value[2] },
        { title: title, order: `${title.toLowerCase()}${order[3]}`, value: value[3] },
      ],
      answer: answer
    });
    // res.redirect(`/quizQuestions/chapter/${req.params.id}`);
    res.redirect(`/questions/quiz/chapter/${req.params.id}`);
  } catch (err) { next(err) }
});

// Get pre test questions of single chapter - GET /questions/pretest/chapter/:id
router.get('/pretest/chapter/:id', async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      const chapter = await Chapter.findById({ _id: req.params.id });
      const pretestQuestions = await Question.find({ chapter: req.params.id, type: "pretest" });
      const user = await User.findById({ _id: req.user._id });
      // console.log(chapter)
      // console.log(pretestQuestions)
      res.render('admin/pretest', { pretestQuestions, chapter, admin: true, user });
    }

    if (req.user.isStudent) {
      const pretestQuestions = await Question.find({ chapter: req.params.id, type: "pretest" });
      const chapter = await Chapter.findById({ _id: req.params.id }).lean();
      // const user = await User.findById({ _id: req.user._id }).populate('chapter');
      const user = await User.findById({ _id: req.user._id });
      // console.log(pretestQuestions)
      // console.log(user)
      // console.log(req.params.id)
      // user.quizzes.forEach((quiz) => {
      //   console.log(quiz.chapter)
      //   // if (quiz.chapter === req.params.id) {
      //   //   console.log('match')
      //   //   // return chapter.isTaken = true, chapter.score = quiz.score
      //   //   // console.log(chapter)
      //   // }
      //   // console.log(quiz)
      // });

      res.render('student/pretest', { chapter, pretestQuestions, userId: req.user._id,
        url1: process.env.NODE_ENV == "development" ? `http://localhost:2000/api/questions/pretest/chapter/${chapter._id}` : `https://lmslbrn.herokuapp.com/api/questions/quiz/chapter/${chapter._id}`,
        url2: process.env.NODE_ENV == "development" ? `http://localhost:2000/users/pretests` : `https://lmslbrn.herokuapp.com/users/quizzes`,
        url3: process.env.NODE_ENV == "development" ? `http://localhost:2000/classes` : `https://lmslbrn.herokuapp.com/classes` })
    }
  } catch (err) { next(err) }
});

// Creates pretest questions of single chapter - POST /questions/pretest/chapter/:id
router.post('/pretest/chapter/:id', async (req, res, next) => {
  try {
    const { title, question, order, value, answer } = req.body;
    const pretestQuestion = await Question.create({
      type: "pretest",
      chapter: req.params.id,
      title: title, question: question,
      choices: [
        { title: title, order: `${title.toLowerCase()}${order[0]}`, value: value[0] },
        { title: title, order: `${title.toLowerCase()}${order[1]}`, value: value[1] },
        { title: title, order: `${title.toLowerCase()}${order[2]}`, value: value[2] },
        { title: title, order: `${title.toLowerCase()}${order[3]}`, value: value[3] },
      ],
      answer: answer
    });
    // res.redirect(`/quizQuestions/chapter/${req.params.id}`);
    res.redirect(`/questions/pretest/chapter/${req.params.id}`);
  } catch (err) { next(err) }
});

// Get post test questions of single chapter - GET /questions/posttest/chapter/:id
router.get('/posttest/chapter/:id', async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      const chapter = await Chapter.findById({ _id: req.params.id });
      const posttestQuestions = await Question.find({ chapter: req.params.id, type: "posttest" });
      const user = await User.findById({ _id: req.user._id });
      // console.log(chapter)
      // console.log(posttestQuestions)
      res.render('admin/posttest', { posttestQuestions, chapter, admin: true, user });
    }

    if (req.user.isStudent) {
      const posttestQuestions = await Question.find({ chapter: req.params.id, type: "posttest" });
      const chapter = await Chapter.findById({ _id: req.params.id }).lean();
      // const user = await User.findById({ _id: req.user._id }).populate('chapter');
      const user = await User.findById({ _id: req.user._id });
      // console.log(user)
      // console.log(req.params.id)
      // user.quizzes.forEach((quiz) => {
      //   console.log(quiz.chapter)
      //   // if (quiz.chapter === req.params.id) {
      //   //   console.log('match')
      //   //   // return chapter.isTaken = true, chapter.score = quiz.score
      //   //   // console.log(chapter)
      //   // }
      //   // console.log(quiz)
      // });

      res.render('student/posttest', { chapter, posttestQuestions, userId: req.user._id,
        url1: process.env.NODE_ENV == "development" ? `http://localhost:2000/api/questions/posttest/chapter/${chapter._id}` : `https://lmslbrn.herokuapp.com/api/questions/quiz/chapter/${chapter._id}`,
        url2: process.env.NODE_ENV == "development" ? `http://localhost:2000/users/posttests` : `https://lmslbrn.herokuapp.com/users/quizzes`,
        url3: process.env.NODE_ENV == "development" ? `http://localhost:2000/classes` : `https://lmslbrn.herokuapp.com/classes` })
    }
  } catch (err) { next(err) }
});

// Creates posttest questions of single chapter - POST /questions/posttest/chapter/:id
router.post('/posttest/chapter/:id', async (req, res, next) => {
  try {
    const { title, question, order, value, answer } = req.body;
    const posttestQuestion = await Question.create({
      type: "posttest",
      chapter: req.params.id,
      title: title, question: question,
      choices: [
        { title: title, order: `${title.toLowerCase()}${order[0]}`, value: value[0] },
        { title: title, order: `${title.toLowerCase()}${order[1]}`, value: value[1] },
        { title: title, order: `${title.toLowerCase()}${order[2]}`, value: value[2] },
        { title: title, order: `${title.toLowerCase()}${order[3]}`, value: value[3] },
      ],
      answer: answer
    });
    // res.redirect(`/quizQuestions/chapter/${req.params.id}`);
    res.redirect(`/questions/posttest/chapter/${req.params.id}`);
  } catch (err) { next(err) }
});

router.get('/', async (req ,res) => {
  try {
    const chapters = await Chapter.find({});
    res.render('admin/quizzes', { chapters });
  } catch (err) { next(err) }
});

module.exports = router;
