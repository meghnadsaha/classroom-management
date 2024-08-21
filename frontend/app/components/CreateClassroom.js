// app/components/CreateClassroom.js
'use client';

import { useState } from 'react';
// import axios from '../src/axiosConfig'; // Adjust the path if necessary
import { TextField, Button, Snackbar, Alert, FormControl, Select,InputLabel, MenuItem ,Checkbox,ListItemText} from '@mui/material';
import axiosInstance from '../src/axiosConfig';



// List of predefined classroom names and days
const classroomOptions = [
  "Apex Room",
  "Beacon Hall",
  "Cedar Lounge",
  "Discovery Lab",
  "Eagle Nest",
  "Falcon Den",
  "Grove Suite",
  "Harmony Space",
  "Innovation Center",
  "Journey Room",
  "Knowledge Hub",
  "Legacy Room",
  "Maple Corner",
  "Nexus Studio",
  "Oasis Room",
  "Pinnacle Place",
  "Quest Room",
  "Radiance Room",
  "Summit Suite",
  "Tranquil Room"
];

  
  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];
  
  
const CreateClassroom = () => {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [days, setDays] = useState([]);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const handleDaysChange = (event) => {
    setDays(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axiosInstance.post(
        '/principal/classrooms',
        { name, startTime, endTime, days },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlertMessage(`Classroom "${response.data.name}" created successfully!`);
      setAlertSeverity('success');

      // Clear form fields
      setName('');
      setStartTime('');
      setEndTime('');
      setDays([]);
    } catch (error) {
      setAlertMessage('Failed to create classroom. Please try again.');
      setAlertSeverity('error');
    } finally {
      setOpen(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* <TextField
          label="Classroom Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /> */}
         <FormControl fullWidth margin="normal">
          <InputLabel>Classroom Name</InputLabel>
          <Select
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Classroom Name"
          >
            {classroomOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Start Time"
          type="time"
          variant="outlined"
          fullWidth
          margin="normal"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <TextField
          label="End Time"
          type="time"
          variant="outlined"
          fullWidth
          margin="normal"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        {/* <TextField
          label="Days (Comma Separated)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={days}
          onChange={(e) => setDays(e.target.value.split(',').map(day => day.trim()))}
        /> */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Days</InputLabel>
          <Select
            multiple
            value={days}
            onChange={handleDaysChange}
            renderValue={(selected) => selected.join(', ')}
            label="Days"
          >
            {daysOfWeek.map((day) => (
              <MenuItem key={day} value={day}>
                <Checkbox checked={days.indexOf(day) > -1} />
                <ListItemText primary={day} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          Create Classroom
        </Button>
      </form>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateClassroom;
