const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
// const Question = require('../models/Question');

// // Get chapter quiz - GET /chapters/:id/quiz
// router.get('/:id/quiz', async (req, res, next) => {
//   try {
//     const chapter = await Chapter.findById({ _id: req.params.id });
//     // console.log(chapter)
//     res.render('admin/quiz', { chapter })
//   } catch (err) { console.log(err.message) }
// });

// Delete single chapter - DELETE /chapters/:id
router.delete('/:id', async (req, res, next) => {
  // console.log(req.params.id)
  try {
    // console.log(req.params.id);
    // console.log(req.body)
    const { subjectId } = req.body;
    await Chapter.findByIdAndDelete({ _id: req.params.id });
    req.flash('success', 'Chapter has been deleted!');
    res.status(200).redirect(`/chapters/subject/${subjectId}`)
  } catch (err) { next(err) }
});

// Get all chapters of subject - GET /chapters/subject/:id
router.get('/subject/:id', async (req, res, next) => {
  try {
    // console.log(req.user)
    if (req.user.isAdmin) {
      const chapters = await Chapter.find({ subject: req.params.id });
      const subject = await Subject.findById({ _id: req.params.id });
      const user = await User.findById({ _id: req.user._id });
      // console.log(chapters)
      res.render('admin/chapters', { subject, chapters, admin: true, user });
    }
    if (req.user.isStudent) {
      const subject = await Subject.findById({ _id: req.params.id});
      const chapters = await Chapter.find({ subject: req.params.id }).populate('subject').lean();
      // console.log(chapters.map((chapter) => chapter._id.toString()));
      const chapterIds = chapters.map((chapter) => chapter._id.toString());
      const user = await User.findById({ _id: req.user._id }).lean();

      if (user.quizzes) {
        user.quizzes.forEach((quiz) => {
          // console.log(quiz.chapter)
          if (chapterIds.includes(quiz.chapter) && quiz.isQuizAnswered) {
            chapters.forEach((chapter) => {
              // chapter.isQuizAnswered = quiz.isQuizAnswered, chapter.score = quiz.score, chapter.questionsLength = quiz.questionsLength;
              chapter.quiz = {
                isQuizAnswered: quiz.isQuizAnswered,
                score: quiz.score,
                questionsLength: quiz.questionsLength
              }
            });
          }
        });
      }

      if (user.pretests) {
        user.pretests.forEach((pretest) => {
          if (chapterIds.includes(pretest.chapter) && pretest.isPretestAnswered) {
            chapters.forEach((chapter) => {
              // chapter.isPretestAnswered = pretest.isPretestAnswered, chapter.score = quiz.score, chapter.questionsLength = quiz.questionsLength;
              chapter.pretest = {
                isPretestAnswered: pretest.isPretestAnswered,
                score: pretest.score,
                questionsLength: pretest.questionsLength
              }
            });
          }
        });
      }

      if (user.posttests) {
        user.posttests.forEach((posttest) => {
          if (chapterIds.includes(posttest.chapter) && posttest.isPosttestAnswered) {
            chapters.forEach((chapter) => {
              chapter.posttest = {
                isPosttestAnswered: posttest.isPosttestAnswered,
                score: posttest.score,
                questionsLength: posttest.questionsLength
              }
            });
          }
        });
      }

      // console.log(user)
      // console.log(chapters)

      res.render('student/chapters', { subject, chapters, user });
    }
  } catch (err) { next(err) }
});

// Creates single chapter of subject - POST /chapters/subject/:id
router.post('/subject/:id', async (req, res, next) => {
  try {
    // console.log(req.body)
    const { title, lesson } = req.body;
    const newChapter = await Chapter.create({
      subject: req.params.id, title, lesson
    })
    res.redirect(`/chapters/subject/${req.params.id}`)
  } catch (err) { next(err) }
});

module.exports = router;
