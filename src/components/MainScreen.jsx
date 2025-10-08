import React, { useState } from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import OrarioGiornaliero from './OrarioGiornaliero';
import ImpegniGiornalieri from './ImpegniGiornalieri';
import Altro from './Altro';

export default function MainScreen() {
  const [value, setValue] = useState(0);

  return (
    <Box sx={{ pb: 7 }}>
      <Box sx={{ p: 2, minHeight: '80vh' }}>
        {value === 0 && <OrarioGiornaliero />}
        {value === 1 && <ImpegniGiornalieri />}
        {value === 2 && <Altro />}
      </Box>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
        >
          <BottomNavigationAction label="Orario" icon={<ScheduleIcon />} />
          <BottomNavigationAction label="Impegni" icon={<AssignmentIcon />} />
          <BottomNavigationAction label="Altro" icon={<MoreHorizIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}