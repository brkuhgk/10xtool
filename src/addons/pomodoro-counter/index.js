/**
 * Pomodoro Counter Addon
 * Timer for the Pomodoro Technique
 */
import React, { useState, useRef, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import './styles.css';

const PomodoroCounter = () => {
  // Timer modes and durations (in seconds)
  const TIMER_MODES = {
    WORK: { name: 'Work', duration: 25 * 60, color: '#8B5CF6' },
    SHORT_BREAK: { name: 'Short Break', duration: 5 * 60, color: '#10B981' },
    LONG_BREAK: { name: 'Long Break', duration: 15 * 60, color: '#3B82F6' }
  };

  // State
  const [timerMode, setTimerMode] = useState(TIMER_MODES.WORK);
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.WORK.duration);
  const [isActive, setIsActive] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const timerRef = useRef(null);
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progressPercentage = () => {
    return ((timerMode.duration - timeLeft) / timerMode.duration) * 100;
  };
  
  // Handle timer completion
  const handleTimerComplete = () => {
    // Play sound
    const audio = new Audio('https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav');
    audio.play();
    
    if (timerMode === TIMER_MODES.WORK) {
      // Increment completed pomodoros
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);
      setCompletedToday(completedToday + 1);
      
      // Save to localStorage
      localStorage.setItem('completedPomodoros', newCount.toString());
      
      const today = new Date().toDateString();
      const savedToday = localStorage.getItem('pomodoroDate');
      const savedCount = parseInt(localStorage.getItem('completedPomodorosToday') || '0');
      
      if (today === savedToday) {
        localStorage.setItem('completedPomodorosToday', (savedCount + 1).toString());
      } else {
        localStorage.setItem('pomodoroDate', today);
        localStorage.setItem('completedPomodorosToday', '1');
      }
      
      // Determine next break type
      if (newCount % 4 === 0) {
        // Long break after 4 pomodoros
        setTimerMode(TIMER_MODES.LONG_BREAK);
        setTimeLeft(TIMER_MODES.LONG_BREAK.duration);
      } else {
        // Short break
        setTimerMode(TIMER_MODES.SHORT_BREAK);
        setTimeLeft(TIMER_MODES.SHORT_BREAK.duration);
      }
    } else {
      // After break, go back to work
      setTimerMode(TIMER_MODES.WORK);
      setTimeLeft(TIMER_MODES.WORK.duration);
    }
    
    // Reset active state
    setIsActive(false);
  };
  
  // Timer effect
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timerMode]);
  
  // Load saved state on mount
  useEffect(() => {
    const savedCount = localStorage.getItem('completedPomodoros');
    if (savedCount) {
      setCompletedPomodoros(parseInt(savedCount));
    }
    
    const today = new Date().toDateString();
    const savedToday = localStorage.getItem('pomodoroDate');
    const savedTodayCount = localStorage.getItem('completedPomodorosToday');
    
    if (today === savedToday && savedTodayCount) {
      setCompletedToday(parseInt(savedTodayCount));
    }
  }, []);
  
  // Timer controls
  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(timerMode.duration);
  };
  
  // Switch timer mode
  const switchMode = (mode) => {
    if (isActive) {
      pauseTimer();
    }
    setTimerMode(mode);
    setTimeLeft(mode.duration);
  };
  
  return (
    <div className="pomodoro-counter">
      <div className="pomodoro-header">
        <Clock size={18} className="pomodoro-icon" />
        <h2 className="pomodoro-title">Pomodoro Timer</h2>
      </div>
      
      <div className="pomodoro-tabs">
        <button 
          className={`pomodoro-tab ${timerMode === TIMER_MODES.WORK ? 'active' : ''}`}
          onClick={() => switchMode(TIMER_MODES.WORK)}
        >
          Work
        </button>
        <button 
          className={`pomodoro-tab ${timerMode === TIMER_MODES.SHORT_BREAK ? 'active' : ''}`}
          onClick={() => switchMode(TIMER_MODES.SHORT_BREAK)}
        >
          Short Break
        </button>
        <button 
          className={`pomodoro-tab ${timerMode === TIMER_MODES.LONG_BREAK ? 'active' : ''}`}
          onClick={() => switchMode(TIMER_MODES.LONG_BREAK)}
        >
          Long Break
        </button>
      </div>
      
      <div className="timer-display-container">
        <div className="timer-progress" style={{ 
          background: `conic-gradient(
            ${timerMode.color} ${progressPercentage()}%, 
            transparent ${progressPercentage()}% 100%
          )`
        }}>
          <div className="timer-circle">
            <span className="timer-display">{formatTime(timeLeft)}</span>
            <span className="timer-mode">{timerMode.name}</span>
          </div>
        </div>
      </div>
      
      <div className="timer-controls">
        {isActive ? (
          <button className="timer-btn" onClick={pauseTimer}>
            <Pause size={20} />
          </button>
        ) : (
          <button className="timer-btn" onClick={startTimer}>
            <Play size={20} />
          </button>
        )}
        
        <button className="timer-btn" onClick={resetTimer}>
          <RotateCcw size={20} />
        </button>
      </div>
      
      <div className="pomodoro-stats">
        <div className="stat-item">
          <CheckCircle size={16} />
          <span>Today: {completedToday}</span>
        </div>
        <div className="stat-item">
          <CheckCircle size={16} />
          <span>Total: {completedPomodoros}</span>
        </div>
      </div>
      
      <div className="pomodoro-tracker">
        {Array.from({ length: 8 }, (_, i) => (
          <div 
            key={i}
            className={`pomodoro-dot ${i < (completedPomodoros % 8) ? 'completed' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PomodoroCounter;