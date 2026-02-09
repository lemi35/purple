import * as React from 'react';
/* import * as ReactDOM from 'react-dom'; */
/* import ReactDOM from 'react-dom'; */
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found.");
}