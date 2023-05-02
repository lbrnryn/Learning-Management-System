const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');

// Add chapter - POST /api/chapters
router.post("/", async (req, res, next) => {
  try {
    const newChapter = await Chapter.create(req.body);
    res.json(newChapter);
  } catch (err) { next(err) }
});

// /api/chapters/:id/quiz
router.get('/:id/quiz', async (req, res, next) => {
  try {
    const chapter = await Chapter.findById({ _id: req.params.id }) ;
    res.json(chapter.quiz)
  } catch (err) { next(err) }
});

// Get chapter with subject id /api/chapters/:id
router.get('/:id', async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id)
    res.json(chapter);
  } catch (err) { next(err) }
});

// Update chapter with subject id /api/chapters/:id
router.put('/:id', async (req, res, next) => {
  try {
    const updChapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updChapter);
  } catch (err) { next(err) }
});

// Delete chapter with subject id /api/chapters/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await Chapter.findByIdAndDelete(req.params.id);
  } catch (err) { next(err) }
});



module.exports = router;
