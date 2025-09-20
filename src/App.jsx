import React from 'react';
import { Toaster } from 'react-hot-toast';
import AppRouter from './routes';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/globals.css';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="App">
          <AppRouter />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #334155',
              },
              success: {
                style: {
                  background: '#065f46',
                  color: '#d1fae5',
                  border: '1px solid #10b981',
                },
              },
              error: {
                style: {
                  background: '#7f1d1d',
                  color: '#fecaca',
                  border: '1px solid #ef4444',
                },
              },
            }}
          />
        </div>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
