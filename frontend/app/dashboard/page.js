// app/dashboard/page.js
'use client';

import { useContext, useEffect } from 'react';
// import AuthContext from '../../src/context/AuthContext';
// import { useRouter } from 'next/router';
import { CircularProgress, Container, Typography } from '@mui/material';
import AuthContext from '../src/context/AuthContext';
import { useRouter } from 'next/navigation';
import CreateClassroom from '../components/CreateClassroom';
import PrincipalDashboard from '../principal/page8';

const Dashboard = () => {
  console.log("useContext(AuthContext) ",useContext(AuthContext))
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // if (loading) {
  //   return <CircularProgress />;
  // }

  console.log("user ",user)

  return (
    <Container>
      {user?.role === 'principal' && (
        <><Typography variant="h4">Principal Dashboard</Typography>
        <PrincipalDashboard/>
        </>
        // {/* // Add Principal-specific components here */}
      )}
      {user?.role === 'teacher' && (
        <Typography variant="h4">Teacher Dashboard</Typography>
        // Add Teacher-specific components here
      )}
      {user?.role === 'student' && (
        <Typography variant="h4">Student Dashboard</Typography>
        // Add Student-specific components here
      )}
    </Container>
  );
};

export default Dashboard;
