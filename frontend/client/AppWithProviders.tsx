/**
 * Main App Component with Redux and Toast Integration
 * Wraps the entire application with necessary providers
 */

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReduxProvider } from '../src/components/providers/ReduxProvider';
import { ToastProvider } from '../src/components/providers/ToastProvider';
import AppRoutes from './AppRoutes';

// Global CSS imports
import './global.css';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <ReduxProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </ToastProvider>
    </ReduxProvider>
  );
};

export default App;
