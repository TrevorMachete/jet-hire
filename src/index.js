// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './Context'; // Import the AppProvider

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <AppProvider> {/* Wrap App with AppProvider */}
      <App />
    </AppProvider>
  </BrowserRouter>
);
