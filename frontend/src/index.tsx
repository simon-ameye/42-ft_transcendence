import App from './App';
import React from 'react';
import './styles/settings.scss';
import { createRoot } from 'react-dom/client'

const element = document.getElementById('root');
const root = createRoot(element!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);