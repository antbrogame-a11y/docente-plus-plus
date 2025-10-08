import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import BarChartIcon from '@mui/icons-material/BarChart';
import HelpIcon from '@mui/icons-material/Help';

// Tutte le funzionalità disponibili
const allFeatures = [
  { key: 'settings', label: 'Impostazioni', icon: <SettingsIcon /> },
  { key: 'history', label: 'Storico', icon: <HistoryIcon /> },
  { key: 'stats', label: 'Statistiche', icon: <BarChartIcon /> },
  { key: 'support', label: 'Assistenza', icon: <HelpIcon /> },
];

export default function Altro() {
  // Recupera i dati di utilizzo da localStorage
  const getUsageData = () => {
    const data = localStorage.getItem('altroUsage');
    return data ? JSON.parse(data) : {};
  };

  const [usageData, setUsageData] = useState(getUsageData());
  const [orderedFeatures, setOrderedFeatures] = useState(allFeatures);

  useEffect(() => {
    // Ordina le funzionalità in base all'utilizzo
    const sorted = [...allFeatures].sort(
      (a, b) => (usageData[b.key] || 0) - (usageData[a.key] || 0)
    );
    setOrderedFeatures(sorted);
  }, [usageData]);

  // Aggiorna il contatore d’uso e salva su localStorage
  const handleFeatureClick = (key) => {
    const newUsageData = { ...usageData, [key]: (usageData[key] || 0) + 1 };
    setUsageData(newUsageData);
    localStorage.setItem('altroUsage', JSON.stringify(newUsageData));
    // Qui aggiungi la logica per aprire la funzionalità selezionata
    // Estensibile: invia newUsageData a un backend per sincronizzazione tra dispositivi
  };

  return (
    <List>
      {orderedFeatures.map((feature) => (
        <React.Fragment key={feature.key}>
          <ListItem button onClick={() => handleFeatureClick(feature.key)}>
            <ListItemIcon>{feature.icon}</ListItemIcon>
            <ListItemText primary={feature.label} />
          </ListItemItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
}