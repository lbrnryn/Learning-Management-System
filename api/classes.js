const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

// Gets all class - GET /api/classes
router.get('/', async (req, res, next) => {
  try {
    const classes = await Class.find({}).populate('subject').populate('teacher').populate('students');
    res.json(classes);
  } catch (err) { next(err) }
});

// Add class - POST /api/classes
router.post('/', async (req, res, next) => {
  try {
    const newClass = await Class.create(req.body);
    res.json(newClass)
  } catch (err) { next(err) }
});

// Gets single class - GET /api/classes/:id
router.get('/:id', async (req, res, next) => {
  try {
    const singleclass = await Class.findById({ _id: req.params.id }).populate('subject').populate('teacher').populate('students');
    res.json(singleclass);
  } catch (err) { next(err) }
});

// Update a class - PUT /api/classes/:id
router.put('/:id', async (req, res, next) => {
  try {
    const updClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updClass);
  } catch (err) { next(err) }
});

// Delete a class - DELETE /api/classes/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const delClass = await Class.findByIdAndDelete(req.params.id);
    res.json(delClass);    
  } catch (err) { next(err) }
});

// Add a student in class - PUT /api/classes/:id/students
router.put('/:id/students', async (req, res, next) => {
  const { students } = req.body;
  try {
    const updClass = await Class.findByIdAndUpdate(req.params.id, {
      $addToSet: { students }
    }, { new: true });
    res.json(updClass);
  } catch (err) { next(err) }
});

module.exports = router;
