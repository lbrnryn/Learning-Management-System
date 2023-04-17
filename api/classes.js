const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// Gets all class - GET /api/classes
router.get('/', async (req, res, next) => {
  try {
    const classes = await Class.find({}).populate('section').populate('subject').populate('teacher').populate('student');
    res.json(classes);
  } catch (err) { next(err) }
});

router.post('/', async (req, res) => {
  console.log(req.body)
})

// Gets single class - GET /api/classes/:id
router.get('/:id', async (req, res, next) => {
  try {
    const singleclass = await Class.findById({ _id: req.params.id }).populate('section').populate('subject').populate('teacher').populate('student');
    res.json(singleclass);
  } catch (err) { next(err) }
});

module.exports = router;
