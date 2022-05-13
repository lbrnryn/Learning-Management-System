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

    const fetchUrl = process.env.NODE_ENV == 'development' ? "http://localhost:2000/api/chapters" : "https://lmslbrn.herokuapp.com/api/chapters"
    res.render('admin/chapters', { subjects, user, admin: true, fetchUrl});
  } catch (err) { next(err) }
});

router.post('/', async (req, res, next) => {
  try {
    const { subject, title, lesson } = req.body;
    const newChapter = await Chapter.create({
      subject, title, lesson
    })
    res.redirect('/chapters')
  } catch (err) { next(err) }
})

module.exports = router;
