import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Alert,
  AlertTitle,
  Chip,
  Paper
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import BarChartIcon from '@mui/icons-material/BarChart';
import HelpIcon from '@mui/icons-material/Help';
import PersonIcon from '@mui/icons-material/Person';
import BackupIcon from '@mui/icons-material/Backup';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Altro Component
 * 
 * Adaptive section that displays various features with usage-based ordering.
 * Features are automatically reordered based on how frequently they are used.
 * 
 * Usage data is stored in localStorage with the key 'altroUsage' and can be
 * easily extended to sync with a backend API.
 * 
 * Features:
 * - Automatic reordering based on usage frequency
 * - localStorage persistence
 * - Visual usage indicators (optional - can be enabled)
 * - Backend sync ready (see extension points below)
 * 
 * Extension points:
 * - Backend sync: See syncUsageDataToBackend() function
 * - Drag and drop reordering: See handleDragEnd() placeholder
 * - Custom feature grouping
 * - User preferences for ordering (manual vs automatic)
 */

// All available features with icons
const allFeatures = [
  { key: 'settings', label: 'Impostazioni', icon: <SettingsIcon />, description: 'Configurazione app' },
  { key: 'history', label: 'Storico', icon: <HistoryIcon />, description: 'Cronologia attività' },
  { key: 'stats', label: 'Statistiche', icon: <BarChartIcon />, description: 'Analisi e report' },
  { key: 'support', label: 'Assistenza', icon: <HelpIcon />, description: 'Supporto e FAQ' },
  { key: 'profile', label: 'Profilo', icon: <PersonIcon />, description: 'Il tuo profilo' },
  { key: 'backup', label: 'Backup', icon: <BackupIcon />, description: 'Backup e ripristino' },
  { key: 'notifications', label: 'Notifiche', icon: <NotificationsIcon />, description: 'Centro notifiche' },
  { key: 'about', label: 'Info App', icon: <InfoIcon />, description: 'Informazioni' },
];

// localStorage key for usage data
const USAGE_DATA_KEY = 'altroUsage';

// Backend API endpoint (placeholder - configure based on your backend)
const BACKEND_API_ENDPOINT = '/api/user/feature-usage';

export default function Altro() {
  /**
   * Get usage data from localStorage
   * Returns an object with feature keys and their usage counts
   */
  const getUsageData = () => {
    try {
      const data = localStorage.getItem(USAGE_DATA_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading usage data:', error);
      return {};
    }
  };

  /**
   * Save usage data to localStorage
   */
  const saveUsageData = (data) => {
    try {
      localStorage.setItem(USAGE_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving usage data:', error);
    }
  };

  /**
   * EXTENSION POINT: Backend Synchronization
   * 
   * This function can be used to sync usage data with a backend server.
   * Uncomment and configure when backend is available.
   * 
   * Example implementation:
   */
  const syncUsageDataToBackend = async (usageData) => {
    // TODO: Implement backend synchronization
    /*
    try {
      const response = await fetch(BACKEND_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getUserToken()}` // Add authentication
        },
        body: JSON.stringify({
          userId: getCurrentUserId(),
          usageData: usageData,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync usage data');
      }
      
      const result = await response.json();
      console.log('Usage data synced successfully:', result);
      return result;
    } catch (error) {
      console.error('Error syncing usage data to backend:', error);
      // Fallback to localStorage only
      return null;
    }
    */
    return Promise.resolve(null);
  };

  /**
   * EXTENSION POINT: Fetch usage data from backend
   * 
   * This function can be used to fetch usage data from the backend
   * when the user logs in or switches devices.
   */
  const fetchUsageDataFromBackend = async () => {
    // TODO: Implement backend data fetching
    /*
    try {
      const response = await fetch(`${BACKEND_API_ENDPOINT}?userId=${getCurrentUserId()}`, {
        headers: {
          'Authorization': `Bearer ${getUserToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch usage data');
      }
      
      const result = await response.json();
      return result.usageData;
    } catch (error) {
      console.error('Error fetching usage data from backend:', error);
      return null;
    }
    */
    return Promise.resolve(null);
  };

  const [usageData, setUsageData] = useState(getUsageData());
  const [orderedFeatures, setOrderedFeatures] = useState(allFeatures);

  /**
   * Reorder features based on usage frequency
   */
  useEffect(() => {
    const sorted = [...allFeatures].sort(
      (a, b) => (usageData[b.key] || 0) - (usageData[a.key] || 0)
    );
    setOrderedFeatures(sorted);
  }, [usageData]);

  /**
   * Handle feature click
   * Increments usage counter and saves to localStorage
   * Can be extended to sync with backend
   */
  const handleFeatureClick = async (key) => {
    // Increment usage counter
    const newUsageData = { ...usageData, [key]: (usageData[key] || 0) + 1 };
    
    // Update state
    setUsageData(newUsageData);
    
    // Save to localStorage
    saveUsageData(newUsageData);
    
    // EXTENSION POINT: Sync to backend
    // Uncomment when backend is available
    // await syncUsageDataToBackend(newUsageData);
    
    // TODO: Navigate to the selected feature
    console.log(`Feature clicked: ${key}`);
    // Add navigation logic here, e.g.:
    // - Open modal
    // - Navigate to route
    // - Trigger specific functionality
  };

  /**
   * EXTENSION POINT: Drag and Drop Reordering
   * 
   * This function is a placeholder for implementing drag-and-drop
   * functionality to manually reorder features.
   * 
   * To implement:
   * 1. Install react-beautiful-dnd or @dnd-kit/core
   * 2. Wrap ListItem components with draggable providers
   * 3. Implement this function to handle reorder
   */
  const handleDragEnd = (result) => {
    // TODO: Implement drag and drop reordering
    /*
    if (!result.destination) return;
    
    const items = Array.from(orderedFeatures);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setOrderedFeatures(items);
    
    // Optionally save the manual order preference
    // This could override automatic ordering
    */
  };

  return (
    <Box>
      {/* Info Section */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <AlertTitle>Sezione Altro</AlertTitle>
        Le funzionalità sono ordinate automaticamente in base all'utilizzo.
        Le più usate appaiono in alto.
      </Alert>

      {/* Features List */}
      <Paper elevation={1}>
        <List>
          {orderedFeatures.map((feature, index) => (
            <React.Fragment key={feature.key}>
              <ListItem
                disablePadding
                secondaryAction={
                  usageData[feature.key] ? (
                    <Chip
                      label={usageData[feature.key]}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ) : null
                }
              >
                <ListItemButton onClick={() => handleFeatureClick(feature.key)}>
                  <ListItemIcon>{feature.icon}</ListItemIcon>
                  <ListItemText
                    primary={feature.label}
                    secondary={feature.description}
                  />
                </ListItemButton>
              </ListItem>
              {index < orderedFeatures.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Debug Info (Optional - remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Debug: Usage Data
          </Typography>
          <pre style={{ fontSize: '10px', overflow: 'auto' }}>
            {JSON.stringify(usageData, null, 2)}
          </pre>
        </Box>
      )}

      {/* Extension Points Summary (for developers) */}
      {/* 
        EXTENSION POINTS:
        1. Backend Sync: Implement syncUsageDataToBackend() and fetchUsageDataFromBackend()
        2. Drag & Drop: Implement handleDragEnd() with a drag-drop library
        3. Feature Navigation: Add routing/modal logic in handleFeatureClick()
        4. User Preferences: Add settings for manual vs automatic ordering
        5. Feature Groups: Add categories/sections for better organization
        6. Analytics: Add tracking for feature usage patterns
      */}
    </Box>
  );
}
