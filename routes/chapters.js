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

module.exports = router;
