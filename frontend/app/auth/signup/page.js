'use client';

import { useState } from 'react';
import { TextField, Button, Container, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../src/axiosConfig';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/auth/signup', { email, password, role });
      setSuccess('Signup successful! Redirecting to login...');
      setError('');
      setOpen(true);
      setTimeout(() => {
        router.push('/auth/login'); // Redirect to login after successful signup
      }, 2000); // Wait for 2 seconds before redirect
    } catch (err) {
      setError('Signup failed. Please try again.');
      setSuccess('');
      setOpen(true);
      console.error('Signup error:', err);
    }
  };

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1">Signup</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            onChange={handleChange}
            label="Role"
          >
            <MenuItem value="principal">Principal</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
            <MenuItem value="student">Student</MenuItem>
          </Select>
          <FormHelperText>Select your role</FormHelperText>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          Signup
        </Button>
      </form>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={error ? 'error' : 'success'}>
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Signup;
