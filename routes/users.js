const express = require('express');
const router = express.Router();
const User = require('../models/User');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const conn = mongoose.createConnection(process.env.NODE_ENV == 'development' ? 'mongodb://127.0.0.1:27017/icctlms' : process.env.MONGO_URI);
let gfs, gridfsBucket;
conn.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
  url: process.env.NODE_ENV == 'development' ? 'mongodb://127.0.0.1:27017/icctlms' : process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) { return reject(err) }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = { filename: filename, bucketName: 'uploads' };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// Upload profile picture - POST - /users/avatar
router.post('/avatar', upload.single('avatar'), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate({ _id: req.user._id }, { avatarUrl: req.file.filename });
    req.flash('success', 'Update successfully!');
    res.status(200).redirect('/users/profile');
  } catch (err) { next(err) }
})

// GET - /users/avatar/:filename
router.get('/avatar/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: 'No file exists' });
    }

    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      const readstream = gridfsBucket.openDownloadStream(file._id);
      readstream.pipe(res);
    } else {
      res.status(404).json({ err: 'Not an image' });
    }
  });
});

// GET - /users/profile
router.get('/profile', async (req, res) => {
  // const user = await User.findById({ _id: req.user._id });
  // res.render('admin/profile', { user });
  res.render('admin/profile');
});

// Update profile - PUT /users/profile
router.put('/profile', async (req, res, next) => {
  const { email, username, firstname, lastname } = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: req.user._id }, { email, username, firstname, lastname });
    req.flash('success', 'Update successfully!');
    res.status(200).redirect('/users/profile');
  } catch (err) { next(err) }
});

// Adds quiz score record - PUT /users/quizzes
router.put('/quizzes', async (req, res, next) => {
  try {
    const { questionsLength, chapterId, score } = req.body;
    const user = await User.findByIdAndUpdate({ _id: req.user._id },
    { $push: { quizzes: {
      questionsLength: questionsLength,
      chapter: chapterId,
      score: score,
      isQuizAnswered: true
    } } });
  } catch (err) { next(err) }
});

// Adds pretest score record - PUT /users/pretests
router.put('/pretests', async (req, res, next) => {
  try {
    const { questionsLength, chapterId, score } = req.body;
    const user = await User.findByIdAndUpdate({ _id: req.user._id },
    { $push: { pretests: {
      questionsLength: questionsLength,
      chapter: chapterId,
      score: score,
      isPretestAnswered: true
    } } });
  } catch (err) { next(err) }
});

// Adds posttest score record - PUT /users/posttests
router.put('/posttests', async (req, res, next) => {
  try {
    const { questionsLength, chapterId, score } = req.body;
    const user = await User.findByIdAndUpdate({ _id: req.user._id },
    { $push: { posttests: {
      questionsLength: questionsLength,
      chapter: chapterId,
      score: score,
      isPosttestAnswered: true
    } } });
  } catch (err) { next(err) }
});

module.exports = router;
