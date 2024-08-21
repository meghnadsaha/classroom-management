
'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
// import { AuthProvider } from '../src/context/AuthContext'; // Ensure correct path
import NavBar from './components/NavBar';
import { AuthProvider } from './src/context/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <NavBar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
