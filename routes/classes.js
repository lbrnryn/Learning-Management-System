const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const User = require('../models/User');
const Chapter = require('../models/Chapter');

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
      const classes = await Class.find({ students: { _id: req.user._id } }).populate('subject').populate('students').lean();
      // const classes = await Class.find().populate('subject').populate('students').lean();
      const user = await User.findById(req.user._id).lean();
      const chapters = await Chapter.find().lean();
      // console.log(classes)
      // console.log(chapters)
      // classes.forEach(data => console.log(data.students))
      // classes.forEach(data => {
      //   chapters.forEach(chapter => {
      //     if (data.subject._id.toString() === chapter.subject.toString()) {
      //       data.subject.chapters = [chapter]
      //     }
      //     // console.log(data.subject._id.toString() === chapter.subject.toString())
      //     // console.log(data.subject._id)
      //     // console.log(chapter.subject)
      //   })
      // })
      // classes.forEach(data => {
      //   console.log(data.subject.chapters, data.subject.chapters.length)
      // })

      const updatedClasses = classes.map(classObj => {
        // const subjectChapters = chapters.filter(chapter => chapter.subject.equals(classObj.subject._id)); // equals() built-in method in mongoose
        const subjectChapters = chapters.filter(chapter => chapter.subject.toString() === classObj.subject._id.toString());
        return {
          ...classObj,
          subject: {
            ...classObj.subject,
            chapters: subjectChapters
          }
        };
      });
      // console.log(updatedClasses)
      
      
      res.render('student/class', {
        title: 'Class - Student',
        classes,
        user,
        isStudent: user.role === 'student',
        helpers: {
          formatTime(timeStart, timeEnd) {
            let [timeStartHour, timeStartMinute] = timeStart.split(':');
            const startHour = timeStartHour > 12 ? (timeStartHour - 12).toString(): timeStartHour;
            const startMinute = timeStartMinute < 10 ? `0${timeStartMinute}`: timeStartMinute;
            const startPeriod = timeStartHour < 12 ? 'am': 'pm';
            // console.log(timeStartHour, timeStartMinute);

            let [timeEndHour, timeEndMinute] = timeEnd.split(':');
            const endHour = timeEndHour > 12 ? (timeEndHour - 12).toString(): timeEndHour;
            const endMinute = timeEndMinute < 10 ? `0${timeEndMinute}`: timeEndMinute;
            const endPeriod = timeEndHour < 12 ? 'am': 'pm';
            // console.log(timeEndHour, timeEndMinute);

            return `${startHour}:${startMinute} ${startPeriod} - ${endHour}:${endMinute} ${endPeriod}`;
          }
        }
      })
    }

  } catch (err) { next(err) }
});

module.exports = router;
