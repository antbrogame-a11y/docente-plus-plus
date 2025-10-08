import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  AlertTitle,
  Paper,
  Divider
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';

/**
 * OrarioGiornaliero Component
 * 
 * Displays the daily schedule for the teacher.
 * This is a placeholder component that can be extended with:
 * - Integration with app.js schedule data
 * - Time slot visualization
 * - Class and subject information
 * - Quick actions for each lesson
 * 
 * Future enhancements:
 * - Connect to localStorage/backend for real schedule data
 * - Add swipe gestures to navigate between days
 * - Show lesson details modal on click
 * - Integration with lesson session tracking
 */
export default function OrarioGiornaliero() {
  // Placeholder data - replace with real data from props or context
  const today = new Date().toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Example placeholder lessons - to be replaced with real data
  const placeholderLessons = [
    { time: '08:00 - 09:00', subject: 'Matematica', class: '3A', room: 'Aula 12' },
    { time: '09:00 - 10:00', subject: 'Fisica', class: '4B', room: 'Lab. Fisica' },
    { time: '11:00 - 12:00', subject: 'Matematica', class: '3B', room: 'Aula 15' },
  ];

  return (
    <Box>
      {/* Header with current date */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon />
          <Typography variant="h6">
            {today}
          </Typography>
        </Box>
      </Paper>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <AlertTitle>Orario Giornaliero</AlertTitle>
        Visualizza qui il tuo orario delle lezioni. 
        {/* TODO: Integrate with real schedule data from app.js */}
      </Alert>

      {/* Lessons List */}
      {placeholderLessons.length > 0 ? (
        <List sx={{ bgcolor: 'background.paper' }}>
          {placeholderLessons.map((lesson, index) => (
            <React.Fragment key={index}>
              <ListItem
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  py: 2,
                  '&:hover': {
                    bgcolor: 'action.hover',
                    cursor: 'pointer'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                  <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                    {lesson.subject}
                  </Typography>
                  <Chip label={lesson.class} size="small" color="primary" />
                </Box>
                <ListItemText
                  primary={lesson.time}
                  secondary={`📍 ${lesson.room}`}
                  primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                />
              </ListItem>
              {index < placeholderLessons.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              Nessuna lezione programmata per oggi
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Extension points for future features */}
      {/* TODO: Add day navigation (previous/next day) */}
      {/* TODO: Add quick action buttons (start lesson, take attendance, etc.) */}
      {/* TODO: Connect to backend API for real-time schedule updates */}
    </Box>
  );
}
