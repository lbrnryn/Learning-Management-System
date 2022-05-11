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
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

router.post('/avatar', upload.single('avatar'), async (req, res, next) => {
  try {
    // console.log(req.file)
    // console.log(req.user)
    const user = await User.findByIdAndUpdate({ _id: req.user._id }, {
      avatarUrl: req.file.filename
    });
    req.flash('success', 'Update successfully!');
    res.status(200).redirect('/users/profile')
  } catch (err) { next(err) }
})

router.get('/avatar/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }


    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      const readstream = gridfsBucket.openDownloadStream(file._id);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

router.get('/profile', async (req, res) => {
  // console.log(req.user)
  const user = await User.findById({ _id: req.user._id });
  res.render('admin/profile', { user });
});

router.post('/profile', async (req, res, next) => {
  // console.log(req.body)
  const { email, username } = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: req.user._id }, {
      email, username
    });
    req.flash('success', 'Update successfully!');
    res.status(200).redirect('/users/profile');
  } catch (err) { next(err) }
})

// Dashboard Page - Updates single user - PUT /users/:id
router.put('/:id', async (req, res, next) => {
  const { email, username, role } = req.body;
  try {
    const foundUser = await User.findById({ _id: req.params.id });
    if (!foundUser) {
      req.flash('error', 'No user found');
      res.status(404).redirect('/dashboard');
    }

    const user = await User.findByIdAndUpdate({ _id: req.params.id }, {
      email, username, isBasic: role !== 'basic' ? false : true, isStudent: role !== 'student' ? false : true, isAdmin: role !== 'admin' ? false : true,
      isTeacher: role !== 'teacher' ? false : true
    });
    req.flash('success', 'Update successfully!');
    res.status(200).redirect('/dashboard');
  } catch (err) { next(err) }
});

// Dashboard Page - Deletes single user - DELETE /users/:id
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete({ _id: req.params.id });
    req.flash('success', 'User has been deleted!')
    res.status(200).redirect('/dashboard')
  } catch (err) { next(err) }
});

module.exports = router;
