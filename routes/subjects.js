const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { checkAuthenticated } = require('../middleware.js');

// Subjects Page - GET /subjects
router.get('/', checkAuthenticated, async (req, res, next) => {
  try {
    const subjectsArr = await Subject.find({}).lean();
    const subjects = subjectsArr.map((subject) => {
      const { _id, year, semester, code, title, units, prerequisite } = subject;

      const firstYear = year == "1st Year" ? true: false;
      const secondYear = year == "2nd Year" ? true: false;
      const thirdYear = year == "3rd Year" ? true: false;
      const fourthYear = year == "4th Year" ? true: false;

      const firstTrimester = semester == "1st Trimester" ? true: false;
      const secondTrimester = semester == "2nd Trimester" ? true: false;
      const thirdTrimester = semester == "3rd Trimester" ? true: false;
      return { _id, year, semester, code, title, units, prerequisite, firstYear, secondYear, thirdYear, fourthYear, firstTrimester, secondTrimester, thirdTrimester }
    });
    res.render('admin/subject', { title: 'Subjects - Admin', subjects, admin: true });
  } catch (err) { next(err) }
});

// Subjects Page - Creates a Subject - POST /subjects
router.post('/', async (req, res, next) => {
  try {
    const { year, semester, code, title, units, prerequisite } = req.body;
    const subject = await Subject.create({ year, semester, code, title, units, prerequisite });
    req.flash('success', 'Successfully added a subject!')
    res.redirect('/subjects')
  } catch (err) { next(err) }
});

// Chapter Page - GET /subjects/:id/chapters
router.get('/:id/chapters', async (req, res, next) => {
  try {

    if (req.user.isAdmin) {
      const subject = await Subject.findById({ _id: req.params.id}).lean();
      res.render('admin/chapters', { id: req.params.id, subject, admin: true });
    }

    const subject = await Subject.findById({ _id: req.params.id}).lean();
    res.render('student/chapters', { subject })
  } catch (err) { next(err) }
});

// Chapter Page - Create single lesson-  PUT /subjects/:id/chapters
router.put('/:id/chapters', async (req, res, next) => {
  try {
    const { title, lesson } = req.body;
    const newChapter = await Subject.findByIdAndUpdate({ _id: req.params.id }, {
      $addToSet: { chapters: { title: title, lesson: lesson } }
    });
    res.redirect(`/subjects/${req.params.id}/chapters`)
  } catch (err) { next(err) }
});

module.exports = router;
