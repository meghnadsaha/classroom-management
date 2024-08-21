// app/components/NavBar.js
'use client';

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useContext } from 'react';
import AuthContext from '../src/context/AuthContext';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Classroom Management
        </Typography>
        {user ? (
          <>
            <Button color="inherit" component={Link} href="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          // <Button color="inherit" component={Link} href="/auth/login">
          //   Login
          // </Button>
          <>
            <Button color="inherit" component={Link} href="/auth/login">
              Login
            </Button>
            <Button color="inherit" component={Link} href="/auth/signup">
              Signup
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
