const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Principal = require('../models/Principal');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  let user;
  switch (role) {
    case 'principal':
      user = await Principal.findOne({ email });
      break;
    case 'teacher':
      user = await Teacher.findOne({ email });
      break;
    case 'student':
      user = await Student.findOne({ email });
      break;
    default:
      return res.status(400).json({ msg: 'Invalid role' });
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  // const token = jwt.sign(
  //   { id: user._id, role },
  //   process.env.JWT_SECRET,
  //   { expiresIn: '1h' }
  // );

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, role: role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );


  // res.json({ token });
  res.status(200).json({ token, user: { id: user._id, email: user.email, role: role } });
});


// // Unified Signup Route
// router.post('/signup', async (req, res) => {
//   const { email, password, role } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     let newUser;
//     switch (role) {
//       case 'teacher':
//         newUser = new Teacher({ email, password: hashedPassword });
//         break;
//       case 'student':
//         newUser = new Student({ email, password: hashedPassword });
//         break;
//       case 'principal':
//         newUser = new Principal({ email, password: hashedPassword });
//         break;
//       default:
//         return res.status(400).json({ msg: 'Invalid role' });
//     }

//     await newUser.save();
//     res.status(201).json({ msg: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully` });
//   } catch (error) {
//     res.status(500).json({ msg: 'Error creating user', error });
//   }
// });

// Unified Signup Route with Duplicate Check
router.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check for existing user with the same email
    let existingUser;
    switch (role) {
      case 'teacher':
        existingUser = await Teacher.findOne({ email });
        break;
      case 'student':
        existingUser = await Student.findOne({ email });
        break;
      case 'principal':
        existingUser = await Principal.findOne({ email });
        break;
      default:
        return res.status(400).json({ msg: 'Invalid role' });
    }

    if (existingUser) {
      return res.status(400).json({ msg: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    let newUser;
    switch (role) {
      case 'teacher':
        newUser = new Teacher({ email, password: hashedPassword });
        break;
      case 'student':
        newUser = new Student({ email, password: hashedPassword });
        break;
      case 'principal':
        newUser = new Principal({ email, password: hashedPassword });
        break;
    }

    await newUser.save();
    res.status(201).json({ msg: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully` });
  } catch (error) {
    res.status(500).json({ msg: 'Error creating user', error });
  }
});


module.exports = router;
