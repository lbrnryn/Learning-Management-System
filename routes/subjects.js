const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const { checkAuthenticated } = require('../middleware.js');

// Subjects Page - GET /subjects
// router.get('/', checkAuthenticated, async (req, res, next) => {
router.get('/', async (req, res, next) => {
  try {
    const subjects = await Subject.find({}).lean();

    subjects.forEach((subject) => {
      const { year, semester } = subject;
      subject.firstYear = year == "1st Year" ? true: false;
      subject.secondYear = year == "2nd Year" ? true: false;
      subject.thirdYear = year == "3rd Year" ? true: false;
      subject.fourthYear = year == "4th Year" ? true: false;

      subject.firstTrimester = semester == "1st Trimester" ? true: false;
      subject.secondTrimester = semester == "2nd Trimester" ? true: false;
      subject.thirdTrimester = semester == "3rd Trimester" ? true: false;
    });
    // console.log(subjects)

    // const user = await User.findById({ _id: req.user._id });
    // res.render('admin/subjects', { title: 'Subjects - Admin', subjects, admin: true, user });
    res.render('admin/subjects', { title: 'Subjects - Admin', subjects, admin: true });

  } catch (err) { next(err) }
});

// Creates single subject - POST /subjects
router.post('/', async (req, res, next) => {
  try {
    const { year, semester, code, title, units, prerequisite } = req.body;
    const subject = await Subject.create({ year, semester, code, title, units, prerequisite });
    req.flash('success', 'Successfully added a subject!');
    res.redirect('/subjects');
  } catch (err) { next(err) }
});

router.put("/:id", async (req, res, next) => {
  try {
    console.log(req.params.id)
  } catch (err) { next(err) }
})

// Delete a subject - DELETE /subjects/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await Subject.findByIdAndDelete({ _id: req.params.id });
    req.flash('success', 'Successfully deleted a subject');
    res.redirect('/subjects');
  } catch (err) { next(err) }
})

// // GET - /subjects/chapters/:id/quizzes
// router.get('/chapters/:id/quizzes', async (req, res) => {
//   try {
//     const chapter = await Chapter.findById({ _id: req.params.id }).lean();
//     const user = await User.findById({ _id: req.user._id })
//
//     user.quizzes.forEach((quiz) => {
//       if (quiz.chapter === req.params.id) {
//         return chapter.isTaken = true, chapter.score = quiz.score
//       }
//     });
//
//     res.render('student/quiz', { chapter, userId: req.user._id })
//   } catch (err) { next(err) }
// });

// // Subject Quizzes Page - GET /subjects/:id/quizzes
// router.get('/:id/quizzes', async (req, res) => {
//   try {
//     // console.log(req.params.id)
//     const chapters = await Chapter.find({ subject: req.params.id });
//     const subject = await Subject.findById({ _id: req.params.id });
//     const user = await User.findById({ _id: req.user._id });
//     // console.log(subject);
//     // console.log(chapters)
//     // console.log(chapters.quizzes)
//     res.render('admin/quizzes', { subject, chapters, user, admin: true })
//   } catch (err) { console.log(err.message) }
// });
//
// // PUT /subjects/:id/quizzes
// router.put('/:id/quizzes', async (req, res) => {
//   try {
//     const { title, question, order, value, answer } = req.body;
//     const chapter = await Chapter.findOneAndUpdate(
//       { subject: req.params.id },
//       { $push: { quiz: {
//         title: title,
//         question: question,
//         choices: [
//           { title: title, order: `${title.toLowerCase()}${order[0]}`, value: value[0] },
//           { title: title, order: `${title.toLowerCase()}${order[1]}`, value: value[1] },
//           { title: title, order: `${title.toLowerCase()}${order[2]}`, value: value[2] },
//           { title: title, order: `${title.toLowerCase()}${order[3]}`, value: value[3] },
//         ],
//         answer: answer
//       } } });
//     // console.log(req.body)
//     res.redirect(`/subjects/${req.params.id}/quizzes`);
//   } catch (err) { console.log(err.message) }
// });

module.exports = router;
