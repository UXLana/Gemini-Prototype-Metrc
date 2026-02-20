import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';
import { ThemeProvider } from 'mtr-design-system/styles/themes';
import { ThemeBridge } from './ThemeBridge';
import { DarkModeProvider } from './hooks/useDarkMode';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <DarkModeProvider>
        <ThemeBridge>
          <App />
        </ThemeBridge>
      </DarkModeProvider>
    </ThemeProvider>
  </React.StrictMode>
);
