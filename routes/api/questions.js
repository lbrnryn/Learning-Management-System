const express = require('express');
const router = express.Router();
// const Chapter = require('../../models/Chapter');
const Questions = require('../../models/Question');

// /api/questions/quiz/chapter/:id
router.get('/quiz/chapter/:id', async (req, res) => {
  try {
    // console.log(req.params.id)
    const quizQuestions = await Questions.find({ chapter: req.params.id, type: "quiz" });
    res.json(quizQuestions);
  } catch (err) { console.log(err.message) }
});

// /api/questions/pretest/chapter/:id
router.get('/pretest/chapter/:id', async (req, res) => {
  try {
    // console.log(req.params.id)
    const pretestQuestions = await Questions.find({ chapter: req.params.id, type: "pretest" });
    res.json(pretestQuestions);
  } catch (err) { console.log(err.message) }
});

// /api/questions/pretest/chapter/:id
router.get('/posttest/chapter/:id', async (req, res) => {
  try {
    // console.log(req.params.id)
    const posttestQuestions = await Questions.find({ chapter: req.params.id, type: "posttest" });
    res.json(posttestQuestions);
  } catch (err) { console.log(err.message) }
});

// // /api/quizQuestions/chapter/:id
// router.get('/chapter/:id', async (req, res) => {
//   try {
//     // console.log(req.params.id)
//     const quizQuestions = await QuizQuestions.find({ chapter: req.params.id });
//     res.json(quizQuestions);
//   } catch (err) { console.log(err.message) }
// });

// router.get('/', async (req, res) => {
//   try {
//     const chapters = await Chapter.find({}).populate('subject');
//     // console.log(chapters[0].quizzes[0].choices)
//     // const choices = chapters[0].quizzes[0].choices.map((choice) => {
//     //   const { order, value } = choice;
//     //   const title = "q1"
//     //   return { title, order, value }
//     // })
//     // console.log(choices)
//     // console.log(chapters[0].quizzes[0])
//     // const oneQuiz = chapters[0].quizzes[0];
//     // oneQuiz.modifiedChoices = choices
//     // console.log(oneQuiz)
//     // res.json(chapters)
//     // quizzes: chapters[0].quizzes
//
//     console.log(chapters)
//     // console.log(chapters[0].quizzes[0].title)
//     // chapters[0].quizzes[0].choices.forEach((choice) => {
//     //   // choice.title = chapters[0].quizzes[0].title
//     //   choice.title = "test"
//     //   // console.log(choice.title)
//     // });
//     // console.log(chapters[0].quizzes[0].choices)
//
//     res.render('test')
//   } catch (err) { console.log(err.message) }
// });
//
// router.post('/', (req, res) => {
//   try {
//     // res.json(req.body)
//     console.log(req.body)
//   } catch (err) { console.log(err.message) }
// });
//
// router.get('/:id', async (req, res) => {
//   try {
//     const chapter = await Chapter.findById({ _id: req.params.id });
//     // res.json(chapter)
//     // console.log(chapter)
//     res.render("test", { chapter })
//   } catch (err) { console.log(err.message) }
// });
//
//
// router.put('/:id', async (req, res) => {
//   try {
//     // console.log(req.body)
//     const { title, question, order, value, answer } = req.body;
//     const chapter = await Chapter.findByIdAndUpdate(
//       { _id: req.params.id },
//       { $push: { quizzes: {
//         title: title,
//         question: question,
//         choices: [
//           { title: title, order: order[0], value: value[0] },
//           { title: title, order: order[1], value: value[1] },
//           { title: title, order: order[2], value: value[2] },
//           { title: title, order: order[3], value: value[3] },
//         ],
//         answer: answer
//       } } });
//
//     res.json(chapter)
//     // console.log(chapter)
//   } catch (err) { console.log(err.message) }
//   // res.json(req.body)
// });

module.exports = router;
