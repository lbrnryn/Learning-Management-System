const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const { checkAuthenticated } = require('../middleware.js');
const formatSubjects = require("../helper");

// GET /subjects
// router.get('/', checkAuthenticated, async (req, res, next) => {
router.get('/', async (req, res, next) => {
  try {

    if (req.user.role === "admin") {
      const subjects = await Subject.find({}).lean();

      res.render('admin/subjects', {
        title: 'Subjects - Admin',
        script: "./admin/subject.js",
        subjects,
        admin: true,
        user: true,
        helpers: {
          firstYearFirstTrimester(subjects) { return formatSubjects(subjects, "1st", "1st") },
          firstYearSecondTrimester(subjects) { return formatSubjects(subjects, "1st", "2nd") },
          firstYearThirdTrimester(subjects) { return formatSubjects(subjects, "1st", "3rd") },
          secondYearFirstTrimester(subjects) { return formatSubjects(subjects, "2nd", "1st") },
          secondYearSecondTrimester(subjects) { return formatSubjects(subjects, "2nd", "2nd") },
          secondYearThirdTrimester(subjects) { return formatSubjects(subjects, "2nd", "3rd") },
          thirdYearFirstTrimester(subjects) { return formatSubjects(subjects, "3rd", "1st") },
          thirdYearSecondTrimester(subjects) { return formatSubjects(subjects, "3rd", "2nd") },
          thirdYearThirdTrimester(subjects) { return formatSubjects(subjects, "3rd", "3rd") },
          fourthYearFirstTrimester(subjects) { return formatSubjects(subjects, "4th", "1st") }
        }
      });

    }

  } catch (err) { next(err) }
});

// Get all chapters of subject - GET /subjects/:id/chapters
router.get('/:id/chapters', async (req, res, next) => {
  try {
    // if (req.user.isAdmin || req.user.isTeacher) {
      const chapters = await Chapter.find({ subject: req.params.id }).lean();
      const subject = await Subject.findById({ _id: req.params.id }).lean();
      // const user = await User.findById({ _id: req.user._id });
      res.render('admin/chapters', { subject, chapters, admin: true, user: true });
    // }
    // if (req.user.isStudent) {
    //   const subject = await Subject.findById({ _id: req.params.id});
    //   const chapters = await Chapter.find({ subject: req.params.id }).populate('subject').lean();
    //   const chapterIds = chapters.map((chapter) => chapter._id.toString());
    //   const user = await User.findById({ _id: req.user._id }).lean();

    //   if (user.quizzes) {
    //     user.quizzes.forEach((quiz) => {
    //       if (chapterIds.includes(quiz.chapter) && quiz.isQuizAnswered) {
    //         chapters.forEach((chapter) => {
    //           chapter.quiz = {
    //             isQuizAnswered: quiz.isQuizAnswered,
    //             score: quiz.score,
    //             questionsLength: quiz.questionsLength
    //           }
    //         });
    //       }
    //     });
    //   }

    //   if (user.pretests) {
    //     user.pretests.forEach((pretest) => {
    //       if (chapterIds.includes(pretest.chapter) && pretest.isPretestAnswered) {
    //         chapters.forEach((chapter) => {
    //           chapter.pretest = {
    //             isPretestAnswered: pretest.isPretestAnswered,
    //             score: pretest.score,
    //             questionsLength: pretest.questionsLength
    //           }
    //         });
    //       }
    //     });
    //   }

    //   if (user.posttests) {
    //     user.posttests.forEach((posttest) => {
    //       if (chapterIds.includes(posttest.chapter) && posttest.isPosttestAnswered) {
    //         chapters.forEach((chapter) => {
    //           chapter.posttest = {
    //             isPosttestAnswered: posttest.isPosttestAnswered,
    //             score: posttest.score,
    //             questionsLength: posttest.questionsLength
    //           }
    //         });
    //       }
    //     });
    //   }

    //   res.render('student/chapters', { subject, chapters, user });
    // }
  } catch (err) { next(err) }
});

// Creates single chapter of subject - POST /subjects/:id/chapters
router.post('/:id/chapters', async (req, res, next) => {
  try {
    const { title, lesson } = req.body;
    await Chapter.create({ subject: req.params.id, title, lesson });
    res.redirect(`/subjects/${req.params.id}/chapters`);
  } catch (err) { next(err) }
});

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
