import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // Global Tailwind & Animation styles

/**
 * Root initialization for OncoMouth AI
 * Utilizing React 18 Concurrent Mode rendering
 */

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element. Ensure index.html has <div id='root'></div>");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);