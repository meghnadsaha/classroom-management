// const express = require('express');
// const Student = require('../models/Student');
// const Classroom = require('../models/Classroom');
// const authMiddleware = require('../middleware/authMiddleware');

// const router = express.Router();

// router.use(authMiddleware);

// // Get timetable for student’s classroom
// router.get('/classroom-timetable', async (req, res) => {
//   const student = await Student.findById(req.user.id).populate('classroom');
//   const timetable = {}; // Fetch timetable based on student's classroom
//   res.json(timetable);
// });




// module.exports = router;


const express = require('express');
const Student = require('../models/Student');
const Timetable = require('../models/Timetable');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Get timetable for student’s classroom
router.get('/classroom-timetable', async (req, res) => {
  try {
    // Find the student and populate the classroom field
    const student = await Student.findById(req.user.id).populate('classroom');
    if (!student || !student.classroom) {
      return res.status(404).json({ msg: 'Student or classroom not found' });
    }

    // Find the timetable entries for the student’s classroom
    const timetable = await Timetable.find({ classroom: student.classroom._id }).populate('teacher');

    res.json(timetable);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
