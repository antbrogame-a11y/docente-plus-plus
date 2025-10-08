import React from 'react';
import ReactDOM from 'react-dom/client';
import MainScreen from './components/MainScreen';

const root = ReactDOM.createRoot(document.getElementById('app-root'));
root.render(
  <React.StrictMode>
    <MainScreen />
  </React.StrictMode>
);
