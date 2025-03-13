/**
 * Pomodoro Activity Addon
 * Displays a heatmap of pomodoro sessions
 */
import React from 'react';
import { Clock } from 'lucide-react';
import './styles.css';

const PomodoroActivity = () => {
  // Sample data for the heatmap
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
  
  // Create a pattern similar to GitHub's contribution graph
  const generatePomodoroData = () => {
    return Array.from({ length: 8 * 28 }, (_, i) => {
      const col = i % 28;
      const row = Math.floor(i / 28);
      
      // Create a wave-like pattern
      const patternValue = Math.sin((col / 28) * Math.PI * 2 + row) + 
                          Math.cos((row / 8) * Math.PI * 3);
      
      // More red in certain columns to match the screenshot pattern
      const colIntensity = (col < 7 || (col > 14 && col < 21) || col > 24) ? 0.7 : 0.3;
      
      // Apply the pattern
      const threshold = 0.2 + colIntensity;
      let cellType = patternValue > threshold ? 2 : 
                    patternValue > threshold - 0.5 ? 1 : 0;
      
      // Add some randomness
      if (Math.random() < 0.2) {
        cellType = Math.floor(Math.random() * 3);
      }
      
      return cellType;
    });
  };

  const pomodoroData = generatePomodoroData();
  
  return (
    <div className="pomodoro-activity">
      <div className="activity-header">
        <Clock size={18} className="activity-icon" />
        <h2 className="activity-title">Pomodoro Activity</h2>
      </div>
      
      <div className="months-header">
        {months.map(month => (
          <span key={month} className="month-label">{month}</span>
        ))}
      </div>
      
      <div className="activity-grid">
        {pomodoroData.map((value, i) => (
          <div 
            key={i} 
            className={`activity-cell ${
              value === 0 ? 'activity-none' : 
              value === 1 ? 'activity-low' : 
              'activity-high'
            }`}
          />
        ))}
      </div>
      
      <div className="activity-legend">
        <span className="legend-label">No pomodoros</span>
        <span className="legend-label">7+ pomodoros</span>
      </div>
    </div>
  );
};

export default PomodoroActivity;