const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const User = require('../models/User');

// Class Page - GET /classes
router.get('/', async (req, res, next) => {
  try {

    if (req.user.role === "admin") {
      const classes = await Class.find({}).populate('subject').populate('teacher').populate('student').lean();

      const sections = classes.map(singleclass => singleclass.section);

      classes.forEach(singleclass => {
        singleclass.classesUrl = process.env.NODE_ENV == 'development' ? `http://localhost:${process.env.PORT}/api/classes/${singleclass._id}` : `https://lmslbrn.herokuapp.com/api/classes/${singleclass._id}`;
        singleclass.studentsUrl = process.env.NODE_ENV == 'development' ? `http://localhost:${process.env.PORT}/api/users/students` : `https://lmslbrn.herokuapp.com/api/users/students`;
      });

      const subjects = await Subject.find({}).lean();
      const users = await User.find({}).lean();
      const teachers = users.filter(user => user.role === "teacher");
      const students = users.filter(user => user.role === "student");

      const user = await User.findById({ _id: req.user._id });
      res.render('admin/class', {
        title: 'Class - Admin',
        script: "./admin/class.js",
        sections,
        classes,
        subjects,
        teachers,
        students,
        // admin: true,
        user
      });
    }

    // // If logger is student
    // if (req.user.isStudent) {
    //   const classes = await Class.find({ student: { _id: req.user._id } }).populate('subject').populate('student');
    //   const user = await User.findById({ _id: req.user._id });
    //   res.render('student/class', { title: 'Class - Student', classes, user })
    // }

  } catch (err) { next(err) }
});

// // Class Page - Creates single class - POST /classes
// router.post('/', async (req, res, next) => {
//   try {
//     const { section, subject, teacher, day, timeStart, timeEnd, room } = req.body;
//     const newClass = await Class.create({ section: { name: section }, subject, teacher, day, timeStart, timeEnd, room });
//     req.flash('success', 'Successfully created a class!')
//     res.redirect('/classes');
//   } catch (err) { next(err) }
// });

// Class Page - Adds single student - PUT /classes/addstudents/:id
router.put('/addstudents/:id', async (req, res, next) => {
  const { classId, student } = req.body;
  try {
    const singleclass = await Class.findByIdAndUpdate({ _id: req.params.id }, {
      $addToSet: { student: student }
    });
    req.flash('success', 'Student is now enrolled in this class')
    res.redirect('/classes');
  } catch (err) { next(err) }
});

// // Class Page - Delete a class - DELETE /classes/:id
// router.delete('/:id', async (req, res, next) => {
//   try {
//     await Class.findByIdAndDelete({ _id: req.params.id });
//     req.flash('success', 'Class has been deleted!');
//     res.status(200).redirect('/classes');
//   } catch (err) { next(err) }
// });

module.exports = router;
