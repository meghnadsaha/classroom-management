const express = require('express');
const Classroom = require('../models/Classroom');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Create classroom
router.post('/classrooms', async (req, res) => {
  const { name, startTime, endTime, days } = req.body;

  try {
    // Check for duplicate classroom
    const existingClassroom = await Classroom.findOne({ name });
    if (existingClassroom) {
      return res.status(400).json({ message: 'Classroom with this name already exists.' });
    }

    // Create new classroom if no duplicate
    const classroom = new Classroom({ name, startTime, endTime, days });
    await classroom.save();
    res.status(201).json(classroom);
  } catch (error) {
    console.error('Error creating classroom:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


// Assign teacher
router.post('/assign-teacher', async (req, res) => {
  const { teacherId, classroomId } = req.body;
  const teacher = await Teacher.findById(teacherId);
  teacher.classroom = classroomId;
  await teacher.save();
  res.status(200).json(teacher);
});

// Assign student
router.post('/assign-student', async (req, res) => {
  const { studentId, classroomId } = req.body;
  const student = await Student.findById(studentId);
  student.classroom = classroomId;
  console.log("student.classroom",JSON.stringify(student.classroom))

  console.log("student",JSON.stringify(student))
  await student.save();
  res.status(200).json(student);

});

// List teachers
router.get('/teachers', async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
});

// List students
router.get('/students', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Update teacher
router.put('/teachers/:id', async (req, res) => {
  const { email } = req.body;
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, { email }, { new: true });
  res.json(teacher);
});

// Update student
router.put('/students/:id', async (req, res) => {
  const { email } = req.body;
  const student = await Student.findByIdAndUpdate(req.params.id, { email }, { new: true });
  res.json(student);
});

// Delete teacher
router.delete('/teachers/:id', async (req, res) => {
  await Teacher.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Delete student
router.delete('/students/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// List classrooms
router.get('/classrooms', async (req, res) => {
  const classrooms = await Classroom.find();
  res.json(classrooms);
});

module.exports = router;
