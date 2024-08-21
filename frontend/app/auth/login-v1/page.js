// app/auth/login.js
'use client';

import { useState, useContext } from 'react';
import { TextField, Button, Container, Typography , Select, MenuItem, InputLabel, FormControl, FormHelperText } from '@mui/material';
import AuthContext from '../../src/context/AuthContext';
import { useRouter } from 'next/navigation';
// import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password, role);
    router.push('/dashboard');
  };

  const handleChange = (event) => {
    setRole(event.target.value);
  };
  
  return (
    <Container>
      <Typography variant="h4" component="h1">Login</Typography>
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
        {/* <TextField
          label="Role"
          fullWidth
          margin="normal"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        /> */}
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
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
