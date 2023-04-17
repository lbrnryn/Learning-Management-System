const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');

// /api/chapters/:id/quiz
router.get('/:id/quiz', async (req, res, next) => {
  try {
    const chapter = await Chapter.findById({ _id: req.params.id }) ;
    res.json(chapter.quiz)
  } catch (err) { next(err) }
});

// Get all chapters with subject id /api/chapters/:id
router.get('/:id', async (req, res, next) => {
  try {
    const chapters = await Chapter.find({ subject: req.params.id }).populate('subject');
    res.json(chapters);
  } catch (err) { next(err) }
});

module.exports = router;
