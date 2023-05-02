const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const User = require('../models/User');

// Class Page - GET /classes
router.get('/', async (req, res, next) => {
  try {

    if (req.user.role === "admin") {
      const users = await User.find({}).lean();
      const students = users.filter(user => user.role === "student");
      const classes = await Class.find({}).populate('subject').populate('teacher').populate('students').lean();
      const subjects = await Subject.find({}).lean();
      const teachers = users.filter(user => user.role === "teacher");
      const user = await User.findById({ _id: req.user._id });
      
      res.render('admin/class', {
        title: 'Class - Admin',
        script: "./admin/class.js",
        classes,
        subjects,
        teachers,
        students,
        // admin: true,
        user
      });

    } else {
      const classes = await Class.find({ student: { _id: req.user._id } }).populate('subject').populate('students').lean();
      const user = await User.findById(req.user._id).lean();
      
      res.render('student/class', {
        title: 'Class - Student',
        classes,
        user,
        isStudent: user.role === 'student',
        helpers: {
          formatTime(timeStart, timeEnd) {
            let [hour, minute] = timeStart.split(':');
            hour = hour > 12 ? (hour - 12).toString(): hour;
            minute = minute < 10 ? `0${minute}`: minute;
            // console.log(hour, minute)
            return `${hour}:${minute} ${hour < 12 ? 'am': 'pm'}`;
          }
        }
      })
    }

  } catch (err) { next(err) }
});

module.exports = router;
