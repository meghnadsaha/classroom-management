// const express = require('express');
// const Classroom = require('../models/Classroom');
// const Teacher = require('../models/Teacher');
// const authMiddleware = require('../middleware/authMiddleware');

// const router = express.Router();

// router.use(authMiddleware);

// // List students in teacher’s classroom
// router.get('/students', async (req, res) => {
//   const teacher = await Teacher.findById(req.user.id).populate('classroom');
//   const students = await Student.find({ classroom: teacher.classroom._id });
//   res.json(students);
// });

// // Create timetable
// router.post('/timetable', async (req, res) => {
//   // Implement timetable creation logic here
//   res.json({ msg: 'Timetable created' });
// });

// module.exports = router;
const express = require('express');
const Timetable = require('../models/Timetable');
const Classroom = require('../models/Classroom');
const Teacher = require('../models/Teacher');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');
const Student = require('../models/Student');
const router = express.Router();

router.use(authMiddleware);

router.get('/students', async (req, res) => {
  try {
    // if (!Student) {
    //   return res.status(500).json({ msg: 'Student model not available' });
    // }

    // Find the teacher based on the authenticated user's ID
        console.log("req.user.id",req.user.id)

    const teacher = await Teacher.findById(req.user.id).populate('classroom');

    // Check if the teacher exists and has a classroom assigned
    if (!teacher) {
      return res.status(404).json({ msg: 'Teacher not found' });
    }

    // console.log("teacher.classroom",teacher.classroom)

    if (!teacher.classroom) {
      return res.status(404).json({ msg: 'Classroom not found for this teacher' });
    }
    console.log("teacher.classroom._id",teacher.classroom._id)
    // Find students in the teacher's classroom

    // Convert to ObjectId if necessary
    const classroomId =new  mongoose.Types.ObjectId(teacher.classroom._id);
    console.log("classroomId",classroomId)

    const students = await Student.find({ classroom: '66be83c923e76cfe7ffe23ea' });

    // Send the list of students as a response
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ msg: error+'   Server error' });
  }
});
// Create timetable
router.post('/timetable', async (req, res) => {
  try {
    const { subject, periods } = req.body;
    
    // Get the teacher's classroom
    const teacher = await Teacher.findById(req.user.id).populate('classroom');
    if (!teacher || !teacher.classroom) {
      return res.status(400).json({ msg: 'Teacher is not assigned to a classroom' });
    }
    
    const classroom = teacher.classroom;

    // Validate periods
    for (const period of periods) {
      const { day, startTime, endTime } = period;

      // Ensure the period is within the classroom's schedule
      if (!classroom.days.includes(day)) {
        return res.status(400).json({ msg: `Classroom is not scheduled on ${day}` });
      }

      const classroomStartTime = classroom.startTime;
      const classroomEndTime = classroom.endTime;

      if (startTime < classroomStartTime || endTime > classroomEndTime) {
        return res.status(400).json({ msg: `Period ${startTime} to ${endTime} is outside classroom hours` });
      }

      // Check for overlapping periods
      for (const existingPeriod of periods) {
        if (existingPeriod !== period &&
            existingPeriod.day === day &&
            ((startTime >= existingPeriod.startTime && startTime < existingPeriod.endTime) ||
            (endTime > existingPeriod.startTime && endTime <= existingPeriod.endTime))) {
          return res.status(400).json({ msg: `Periods overlap on ${day}` });
        }
      }
    }

    // Create timetable entry
    const timetable = new Timetable({
      teacher: teacher._id,
      classroom: classroom._id,
      subject,
      periods,
    });

    await timetable.save();
    res.status(201).json({ msg: 'Timetable created', timetable });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});
// Get timetable by teacher ID
router.get('/timetable/teacher/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    
    // Fetch timetable entries for the given teacher ID
    const timetables = await Timetable.find({ teacher: teacherId }).populate('classroom');

    if (!timetables.length) {
      return res.status(404).json({ msg: 'No timetables found for this teacher' });
    }

    res.status(200).json(timetables);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});
// Get timetable by classroom ID
router.get('/timetable/classroom/:classroomId', async (req, res) => {
  try {
    const { classroomId } = req.params;
    
    // Fetch timetable entries for the given classroom ID
    const timetables = await Timetable.find({ classroom: classroomId }).populate('teacher');

    if (!timetables.length) {
      return res.status(404).json({ msg: 'No timetables found for this classroom' });
    }

    res.status(200).json(timetables);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});



module.exports = router;
