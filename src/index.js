import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // Importation du Service Worker
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Enregistrement du Service Worker pour activer la PWA
serviceWorkerRegistration.register(); // Remplacer `unregister()` par `register()`

// Si vous voulez suivre les performances de l'application
reportWebVitals();
