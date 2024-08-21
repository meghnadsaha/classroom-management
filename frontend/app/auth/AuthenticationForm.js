// app/auth/AuthenticationForm.js
'use client';

import { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Select, MenuItem, InputLabel, FormControl, FormHelperText } from '@mui/material';
// import AuthContext from '../../src/context/AuthContext';
import { useRouter } from 'next/navigation';
import AuthContext from '../src/context/AuthContext';

const AuthenticationForm = ({ action }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const { login, signup } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (action === 'login') {
      await login(email, password, role);
      router.push('/dashboard');
    } else if (action === 'signup') {
      await signup(email, password, role);
      // router.push('/login');
    }
  };

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1">{action === 'login' ? 'Login' : 'Signup'}</Typography>
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
          {action === 'login' ? 'Login' : 'Signup'}
        </Button>
      </form>
    </Container>
  );
};

export default AuthenticationForm;
