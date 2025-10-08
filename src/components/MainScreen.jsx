import React, { useState } from 'react';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container
} from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import OrarioGiornaliero from './OrarioGiornaliero';
import ImpegniGiornalieri from './ImpegniGiornalieri';
import Altro from './Altro';

// Material UI theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#4a90e2',
    },
    secondary: {
      main: '#f39c12',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
});

/**
 * MainScreen Component
 * 
 * Main post-login interface with bottom navigation for switching between sections:
 * - Orario Giornaliero (Daily Schedule)
 * - Impegni Giornalieri (Daily Tasks)
 * - Altro (Other - with usage-based ordering)
 * 
 * Uses Material UI's BottomNavigation for mobile-first design
 */
export default function MainScreen() {
  const [value, setValue] = useState(0);

  const handleNavigationChange = (event, newValue) => {
    setValue(newValue);
  };

  // Section titles for the app bar
  const sectionTitles = ['Orario Giornaliero', 'Impegni Giornalieri', 'Altro'];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ pb: 7, minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Top AppBar with current section title */}
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {sectionTitles[value]}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main content area */}
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          <Box sx={{ minHeight: 'calc(100vh - 180px)' }}>
            {value === 0 && <OrarioGiornaliero />}
            {value === 1 && <ImpegniGiornalieri />}
            {value === 2 && <Altro />}
          </Box>
        </Container>

        {/* Bottom Navigation - Fixed at bottom */}
        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={handleNavigationChange}
          >
            <BottomNavigationAction
              label="Orario"
              icon={<ScheduleIcon />}
              aria-label="Orario Giornaliero"
            />
            <BottomNavigationAction
              label="Impegni"
              icon={<AssignmentIcon />}
              aria-label="Impegni Giornalieri"
            />
            <BottomNavigationAction
              label="Altro"
              icon={<MoreHorizIcon />}
              aria-label="Altro"
            />
          </BottomNavigation>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}