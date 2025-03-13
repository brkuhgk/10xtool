import React, { useEffect } from 'react';
import './App.css';
import GridDashboard from './components/GridDashboard';

function App() {
  localStorage.removeItem('dashboardLayouts');


  // Error handling for layout corruption
  useEffect(() => {
    const handleError = (event) => {
      if (event.error && (
        event.error.message.includes('undefined') || 
        event.error.message.includes('null') ||
        event.error.message.includes('width')
      )) {
        console.warn('Detected potential layout corruption, resetting layouts');
        localStorage.removeItem('dashboardLayouts');
        localStorage.removeItem('activeAddons');
        window.location.reload();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <div className="App">
      <GridDashboard />
    </div>
  );
}

export default App;