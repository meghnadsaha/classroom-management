'use client';

import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { Snackbar, Alert } from '@mui/material';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     axios.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
  //       .then(res => setUser(res.data))
  //       .catch(() => localStorage.removeItem('token'))
  //       .finally(() => setLoading(false));
  //   } else {
  //     setLoading(false);
  //   }
  // }, []);

  const login = async (email, password, role) => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password, role });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);

      setSnackbarMessage('Signin successful! Redirecting to dashboard...');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Login failed. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setSnackbarMessage('Logout successful! Redirecting to home...');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setUser(null);
  };

  const signup = async (email, password, role) => {
    try {
      const response = await axiosInstance.post('/auth/signup', { email, password, role });
      setSnackbarMessage(response.data.msg);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Signup failed. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Signup failed', error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, signup }}>
      {children}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        // anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
};

export default AuthContext;
