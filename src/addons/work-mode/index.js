/**
 * Work Mode Addon
 * Toggle focused work mode with automatic website blocking
 */
import React, { useState, useEffect } from 'react';
import { Briefcase, Sun, Moon, Bell, BellOff, EyeOff, Timer } from 'lucide-react';
import './styles.css';

const WorkMode = () => {
  // States
  const [workModeActive, setWorkModeActive] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notificationsBlocked, setNotificationsBlocked] = useState(false);
  const [distractionsBlocked, setDistractionsBlocked] = useState(false);
  const [focusTime, setFocusTime] = useState(45);
  const [activeTime, setActiveTime] = useState(0);
  const [timer, setTimer] = useState(null);
  
  // Get document theme provider
  const toggleDarkMode = () => {
    // This assumes your app has a global dark/light theme toggle
    setDarkMode(!darkMode);
    
    // This would ideally hook into your app's theme system
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
  };
  
  // Toggle work mode
  const toggleWorkMode = () => {
    const newState = !workModeActive;
    setWorkModeActive(newState);
    
    if (newState) {
      // Starting work mode
      if (distractionsBlocked) {
        // This would ideally connect to a browser extension
        console.log('Blocking distracting websites...');
      }
      
      if (notificationsBlocked) {
        // This would request notification permissions and block them
        console.log('Blocking notifications...');
      }
      
      // Start timer
      const newTimer = setInterval(() => {
        setActiveTime(prev => prev + 1);
      }, 60000); // Update every minute
      
      setTimer(newTimer);
    } else {
      // Stopping work mode
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
      
      // Reset active time
      setActiveTime(0);
      
      // This would unblock sites and re-enable notifications
      console.log('Work mode deactivated');
    }
  };
  
  // Toggle notification blocking
  const toggleNotifications = () => {
    setNotificationsBlocked(!notificationsBlocked);
  };
  
  // Toggle distraction blocking
  const toggleDistractions = () => {
    setDistractionsBlocked(!distractionsBlocked);
  };
  
  // Update focus time
  const updateFocusTime = (e) => {
    setFocusTime(parseInt(e.target.value));
  };
  
  // Format time display
  const formatActiveTime = () => {
    if (activeTime < 60) return `${activeTime}m`;
    const hours = Math.floor(activeTime / 60);
    const mins = activeTime % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);
  
  return (
    <div className="work-mode-addon">
      <div className="work-mode-header">
        <Briefcase size={18} className="work-mode-icon" />
        <h2 className="work-mode-title">Work Mode</h2>
      </div>
      
      <div className="work-mode-toggle-container">
        <button 
          className={`work-mode-toggle ${workModeActive ? 'active' : ''}`}
          onClick={toggleWorkMode}
        >
          <Briefcase size={20} />
          <span>{workModeActive ? 'Exit Work Mode' : 'Start Work Mode'}</span>
        </button>
      </div>
      
      {workModeActive && (
        <div className="active-timer">
          <div className="timer-label">
            <Timer size={14} />
            <span>Focus time:</span>
          </div>
          <div className="timer-value">{formatActiveTime()}</div>
        </div>
      )}
      
      <div className="work-mode-options">
        <div className="option-item">
          <div className="option-info">
            <Bell size={16} />
            <span>Block Notifications</span>
          </div>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={notificationsBlocked} 
              onChange={toggleNotifications}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        
        <div className="option-item">
          <div className="option-info">
            <EyeOff size={16} />
            <span>Block Distractions</span>
          </div>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={distractionsBlocked} 
              onChange={toggleDistractions}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        
        <div className="option-item">
          <div className="option-info">
            <Timer size={16} />
            <span>Focus Duration</span>
          </div>
          <select 
            className="focus-select"
            value={focusTime}
            onChange={updateFocusTime}
          >
            <option value="25">25 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
            <option value="120">2 hours</option>
          </select>
        </div>
        
        <div className="option-item">
          <div className="option-info">
            {darkMode ? <Moon size={16} /> : <Sun size={16} />}
            <span>Theme</span>
          </div>
          <button 
            className="theme-button"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
      
      {workModeActive && (
        <div className="work-mode-status">
          <p>Work mode is active. Stay focused!</p>
        </div>
      )}
    </div>
  );
};

export default WorkMode;