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
      res.render('admin/quiz', { quizQuestions, chapter, admin: true, user });
    }

    if (req.user.isStudent) {
      const quizQuestions = await Question.find({ chapter: req.params.id, type: "quiz" });
      const chapter = await Chapter.findById({ _id: req.params.id }).lean();
      const user = await User.findById({ _id: req.user._id });

      res.render('student/quiz', { chapter, quizQuestions, userId: req.user._id,
        url: process.env.NODE_ENV == "development" ? `http://localhost:${process.env.PORT}` : `https://lmslbrn.herokuapp.com` })
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
      res.render('admin/pretest', { pretestQuestions, chapter, admin: true, user });
    }

    if (req.user.isStudent) {
      const pretestQuestions = await Question.find({ chapter: req.params.id, type: "pretest" });
      const chapter = await Chapter.findById({ _id: req.params.id }).lean();
      const user = await User.findById({ _id: req.user._id });

      res.render('student/pretest', { chapter, pretestQuestions, userId: req.user._id,
        url: process.env.NODE_ENV == "development" ? `http://localhost:${process.env.PORT}` : `https://lmslbrn.herokuapp.com` })
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
      res.render('admin/posttest', { posttestQuestions, chapter, admin: true, user });
    }

    if (req.user.isStudent) {
      const posttestQuestions = await Question.find({ chapter: req.params.id, type: "posttest" });
      const chapter = await Chapter.findById({ _id: req.params.id }).lean();
      const user = await User.findById({ _id: req.user._id });

      res.render('student/posttest', { chapter, posttestQuestions, userId: req.user._id,
        url: process.env.NODE_ENV == "development" ? `http://localhost:${process.env.PORT}` : `https://lmslbrn.herokuapp.com` })
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
