import React from 'react';
import './App.css';
import GridDashboard from './components/GridDashboard';
import { GridDashboardWrapper } from './components/ResponsiveHelper';
import { TouchInteractionProvider } from './components/TouchInteractionProvider';

function App() {
  // Clear any corrupted layout data on error
  React.useEffect(() => {
    const handleError = (event) => {
      if (event.error && (
        event.error.message.includes('width') || 
        event.error.message.includes('undefined') ||
        event.error.message.includes('null')
      )) {
        console.warn('Detected potential layout corruption, resetting saved layout');
        localStorage.removeItem('dashboardLayouts');
        // Optionally reload the page after clearing
        // window.location.reload();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <div className="App">
      <TouchInteractionProvider>
        <GridDashboardWrapper>
          <GridDashboard />
        </GridDashboardWrapper>
      </TouchInteractionProvider>
    </div>
  );
}

export default App;