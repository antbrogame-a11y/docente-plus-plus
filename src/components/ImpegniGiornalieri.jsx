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
  IconButton,
  Paper,
  Divider,
  LinearProgress
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import EditIcon from '@mui/icons-material/Edit';

/**
 * ImpegniGiornalieri Component
 * 
 * Displays daily tasks and commitments for the teacher.
 * This is a placeholder component that can be extended with:
 * - Integration with app.js activities data
 * - Task status tracking (pending, in-progress, completed)
 * - Priority indicators
 * - Due date alerts
 * - Quick actions for task management
 * 
 * Future enhancements:
 * - Connect to localStorage/backend for real task data
 * - Add task creation and editing functionality
 * - Implement task completion tracking
 * - Add notifications for upcoming deadlines
 * - Integration with calendar for deadline visualization
 */
export default function ImpegniGiornalieri() {
  // Placeholder data - replace with real data from props or context
  const today = new Date().toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Example placeholder tasks - to be replaced with real data
  const placeholderTasks = [
    {
      id: 1,
      title: 'Correzione verifiche 3A',
      status: 'in-progress',
      priority: 'high',
      dueDate: 'Oggi',
      progress: 60
    },
    {
      id: 2,
      title: 'Preparazione lezione Fisica',
      status: 'pending',
      priority: 'medium',
      dueDate: 'Domani',
      progress: 0
    },
    {
      id: 3,
      title: 'Riunione dipartimento',
      status: 'completed',
      priority: 'low',
      dueDate: 'Oggi 15:00',
      progress: 100
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'in-progress':
        return <PendingIcon color="warning" />;
      default:
        return <AssignmentIcon color="action" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Header with current date */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'secondary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon />
          <Typography variant="h6">
            {today}
          </Typography>
        </Box>
      </Paper>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <AlertTitle>Impegni Giornalieri</AlertTitle>
        Gestisci le tue attività e impegni quotidiani.
        {/* TODO: Integrate with real activities data from app.js */}
      </Alert>

      {/* Tasks List */}
      {placeholderTasks.length > 0 ? (
        <List sx={{ bgcolor: 'background.paper' }}>
          {placeholderTasks.map((task, index) => (
            <React.Fragment key={task.id}>
              <ListItem
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  py: 2,
                  opacity: task.status === 'completed' ? 0.7 : 1
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                  <Box sx={{ mr: 1 }}>
                    {getStatusIcon(task.status)}
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                      flexGrow: 1,
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none'
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Chip
                    label={task.priority}
                    size="small"
                    color={getPriorityColor(task.priority)}
                  />
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>

                <ListItemText
                  primary={`Scadenza: ${task.dueDate}`}
                  primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                />

                {task.status === 'in-progress' && (
                  <Box sx={{ width: '100%', mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Progresso
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {task.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={task.progress} />
                  </Box>
                )}
              </ListItem>
              {index < placeholderTasks.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              Nessun impegno programmato per oggi
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Extension points for future features */}
      {/* TODO: Add task creation button (FAB - Floating Action Button) */}
      {/* TODO: Add task filtering (by status, priority, date) */}
      {/* TODO: Add task completion toggle */}
      {/* TODO: Connect to backend API for task synchronization */}
      {/* TODO: Implement drag-and-drop for task reordering */}
    </Box>
  );
}
