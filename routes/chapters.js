const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');

router.get('/', async (req, res, next) => {
  try {
    const subjects = await Subject.find({})
    const chapters = await Chapter.find({}).populate('subject')
    const user = await User.findById({ _id: req.user._id });
    // const subjectsArr = await Subject.find({})
    // const chaptersArr = await Chapter.find({}).populate('subject')
    // const user = await User.findById({ _id: req.user._id });
    //
    // const subjects = subjectsArr.map((subject) => {
    //   const chapters = chaptersArr.filter((chapter) => {
    //     if (chapter.subject._id == subject._id) {
    //       return chapter
    //     }
    //   })
    //   subject.chapters = chapters;
    //   return subject
    // })
    // console.log(subjects)
    console.log(chapters)
    res.render('admin/chapters', { subjects, user });
  } catch (err) { next(err) }
});

router.post('/', async (req, res, next) => {
  try {
    // console.log(req.body);
    const { subject, title, lesson } = req.body;
    const newChapter = await Chapter.create({
      subject, title, lesson
    })
    // console.log(newChapter)
    res.redirect('/chapters')
  } catch (err) { next(err) }
})

module.exports = router;
