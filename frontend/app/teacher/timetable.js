'use client';

import { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../src/axiosConfig';
import AuthContext from '../../src/context/AuthContext';

const Timetable = () => {
  const [subject, setSubject] = useState('');
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/teacher/timetable', {
        subject,
        periods: [{ day, startTime, endTime }]
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSnackbarMessage(response.data.msg);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setSuccess('Timetable created successfully!');
      // Optionally redirect or reset form
      // router.push('/some-page');
    } catch (err) {
      setSnackbarMessage('Failed to create timetable. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setError('Creation failed');
      console.error('Timetable creation failed:', err);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1">Create Timetable</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Subject"
          fullWidth
          margin="normal"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Day</InputLabel>
          <Select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            label="Day"
          >
            <MenuItem value="Monday">Monday</MenuItem>
            <MenuItem value="Tuesday">Tuesday</MenuItem>
            <MenuItem value="Wednesday">Wednesday</MenuItem>
            <MenuItem value="Thursday">Thursday</MenuItem>
            <MenuItem value="Friday">Friday</MenuItem>
          </Select>
          <FormHelperText>Select the day</FormHelperText>
        </FormControl>
        <TextField
          label="Start Time"
          type="time"
          fullWidth
          margin="normal"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <TextField
          label="End Time"
          type="time"
          fullWidth
          margin="normal"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Create Timetable
        </Button>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Timetable;
