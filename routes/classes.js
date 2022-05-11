const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const User = require('../models/User');

// Class Page - GET /classes
router.get('/', async (req, res, next) => {
  try {

    // If logger is admin
    if (req.user.isAdmin) {
      const classesArr = await Class.find({}).populate('subject').populate('teacher').populate('student').lean();

      const sections = classesArr.map((singleclass) => {
        return singleclass.section
      });

      const classes = classesArr.map((singleclass) => {
        const { _id, section, subject, teacher, student, day, timeStart, timeEnd, room } = singleclass;
        const classesfetchurl = process.env.NODE_ENV == 'development' ? `http://localhost:2000/api/classes/${_id}` : `https://lmslbrn.herokuapp.com/api/classes/${_id}`;
        const studentsfetchurl = process.env.NODE_ENV == 'development' ? `http://localhost:2000/api/users/students` : `https://lmslbrn.herokuapp.com/api/users/students`;
        return { _id, section, subject, teacher, student, day, timeStart, timeEnd, room, classesfetchurl, studentsfetchurl }
      })

      const subjects = await Subject.find({}).lean();
      const users = await User.find({}).lean();
      const teachers = users.filter(user => user.isTeacher);
      const students = users.filter(user => user.isStudent);
      // console.log(classesArr)

      const user = await User.findById({ _id: req.user._id });
      res.render('admin/class', { title: 'Class - Admin', sections, classes, subjects, teachers, students, admin: true, user })
    }

    // If logger is student
    if (req.user.isStudent) {
      const classesArr = await Class.find({ student: { _id: req.user._id } }).populate('subject').populate('student').lean();
      const classes = classesArr.map(singleclass => singleclass);
      const user = await User.findById({ _id: req.user._id });
      res.render('student/class', { title: 'Class - Student', classes, user })
    }

  } catch (err) { next(err) }
});

// Class Page - Creates single class - POST /classes
router.post('/', async (req, res, next) => {
  try {
    const { section, subject, teacher, day, timeStart, timeEnd, room } = req.body;
    const newClass = await Class.create({ section: { name: section }, subject, teacher, day, timeStart, timeEnd, room });
    req.flash('success', 'Successfully created a class!')
    res.redirect('/classes');
  } catch (err) { next(err) }
});

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

module.exports = router;
