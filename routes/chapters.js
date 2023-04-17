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
  try {
    const { subjectId } = req.body;
    await Chapter.findByIdAndDelete({ _id: req.params.id });
    req.flash('success', 'Chapter has been deleted!');
    res.status(200).redirect(`/chapters/subject/${subjectId}`);
  } catch (err) { next(err) }
});

module.exports = router;
