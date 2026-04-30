// ============================================
// REACT APPLICATION ENTRY POINT
// ============================================
// PURPOSE: Initialize React app, mount to DOM, and wrap with providers.
// FLOW:
// 1. Import React utilities, CSS, and main App component
// 2. Import ErrorBoundary for error handling
// 3. Create React root and render App wrapped in providers
// ============================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';

// Mount React app to #root element in index.html
// StrictMode: development tool to highlight potential problems
// ErrorBoundary: catches runtime errors and shows fallback UI
creatRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
