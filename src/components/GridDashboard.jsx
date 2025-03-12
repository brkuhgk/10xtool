import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Calendar, Clock, CheckCircle, Circle, AlertTriangle, BarChart2, Briefcase, Play, Pause, X, Moon, Sun } from 'lucide-react';
import classNames from 'classnames';
import _ from 'lodash';

// Import CSS files from react-grid-layout
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './GridDashboard.css';

// Create a responsive grid layout with automatic width calculation
const ResponsiveGridLayout = WidthProvider(Responsive);

// Default layouts for different breakpoints
const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'pomodoroActivity', x: 0, y: 0, w: 6, h: 8, minW: 4, minH: 6 },
    { i: 'calendar', x: 0, y: 8, w: 3, h: 8, minW: 3, minH: 6 },
    { i: 'position', x: 3, y: 8, w: 3, h: 4, minW: 2, minH: 4 },
    { i: 'workMode', x: 3, y: 12, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'quickNote', x: 6, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'completedTasks', x: 6, y: 4, w: 6, h: 12, minW: 3, minH: 6 },
    { i: 'todoTasks', x: 12, y: 0, w: 6, h: 8, minW: 3, minH: 6 },
    { i: 'overdueTasks', x: 12, y: 8, w: 6, h: 8, minW: 3, minH: 6 },
    { i: 'pomodoroCounter', x: 0, y: 16, w: 3, h: 10, minW: 3, minH: 8 }
  ],
  md: [
    { i: 'pomodoroActivity', x: 0, y: 0, w: 6, h: 7, minW: 4, minH: 6 },
    { i: 'calendar', x: 0, y: 7, w: 3, h: 7, minW: 3, minH: 6 },
    { i: 'position', x: 3, y: 7, w: 3, h: 3, minW: 2, minH: 3 },
    { i: 'workMode', x: 3, y: 10, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'quickNote', x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
    { i: 'completedTasks', x: 6, y: 3, w: 6, h: 11, minW: 3, minH: 6 },
    { i: 'todoTasks', x: 0, y: 14, w: 6, h: 8, minW: 3, minH: 6 },
    { i: 'overdueTasks', x: 6, y: 14, w: 6, h: 8, minW: 3, minH: 6 },
    { i: 'pomodoroCounter', x: 9, y: 0, w: 3, h: 9, minW: 3, minH: 8 }
  ],
  sm: [
    { i: 'pomodoroActivity', x: 0, y: 0, w: 6, h: 7, minW: 3, minH: 6 },
    { i: 'calendar', x: 0, y: 7, w: 3, h: 7, minW: 3, minH: 6 },
    { i: 'position', x: 3, y: 7, w: 3, h: 3, minW: 2, minH: 3 },
    { i: 'workMode', x: 3, y: 10, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'quickNote', x: 0, y: 14, w: 6, h: 3, minW: 2, minH: 3 },
    { i: 'completedTasks', x: 0, y: 17, w: 6, h: 11, minW: 3, minH: 6 },
    { i: 'todoTasks', x: 0, y: 28, w: 6, h: 8, minW: 3, minH: 6 },
    { i: 'overdueTasks', x: 0, y: 36, w: 6, h: 8, minW: 3, minH: 6 },
    { i: 'pomodoroCounter', x: 0, y: 44, w: 6, h: 9, minW: 3, minH: 8 }
  ]
};

// Custom card component with consistent styling
const DashboardCard = ({ className, title, children, icon: Icon, accentColor = "text-red-500" }) => {
  return (
    <div className={classNames('dashboard-card', className)}>
      {title && (
        <div className="card-header">
          <div className={`flex items-center gap-2 ${accentColor}`}>
            {Icon && <Icon size={18} />}
            <h2 className="font-semibold">{title}</h2>
          </div>
          <div className="card-actions">
            {/* Any action buttons can go here */}
          </div>
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

const GridDashboard = () => {
  // State for layouts (responsive)
  const [layouts, setLayouts] = useState(DEFAULT_LAYOUTS);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const [mounted, setMounted] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);
  
  // Pomodoro activity data
  const [pomodoroData, setPomodoroData] = useState(
    Array.from({ length: 8 * 28 }, (_, i) => {
      const col = i % 28;
      const row = Math.floor(i / 28);
      const patternValue = Math.sin((col / 28) * Math.PI * 2 + row) + 
                      Math.cos((row / 8) * Math.PI * 3);
      const colIntensity = (col < 7 || (col > 14 && col < 21) || col > 24) ? 0.7 : 0.3;
      const threshold = 0.2 + colIntensity;
      let cellType = patternValue > threshold ? 2 : 
                  patternValue > threshold - 0.5 ? 1 : 0;
      if (Math.random() < 0.2) {
        cellType = Math.floor(Math.random() * 3);
      }
      return cellType;
    })
  );
  
  // Pomodoro timer state
  const [timerActive, setTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [workMode, setWorkMode] = useState(false);
  
  // Current month and calendar data
  const currentMonth = 'March 2025';
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
  const [selectedDate, setSelectedDate] = useState(11);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  // Points and rank
  const [points, setPoints] = useState(259);
  const [rank, setRank] = useState(2);
  
  // Quick Note state
  const [quickNote, setQuickNote] = useState("Stop reading my todos 😩");
  const [isEditingNote, setIsEditingNote] = useState(false);
  
  // Task lists
  const [completedTasks, setCompletedTasks] = useState([
    'Calendar fix',
    'Figure out customer Sizzy subscriptions that...',
    'Pay for hirezify.io',
    'Ship new landing page vs todoist etc',
    'Menus don\'t have bg on vaul',
    'See why users cannot send pass reset email...',
    'benji email verification doesn\'t work',
    'Pay mailgun',
    'Text accountant',
    'Sizzy downloads for apple silicon',
    'Refund customer',
    'fix guy\'s sub on benji',
    'Move benji to coolify',
    'Deploy glink',
    'Make sure ppl can buy sizzy',
    'Sizzy new subs don\'t load',
    'Pay PIT for Nov/Dec',
    'Finalize taxes with accountant',
    'see PIT email',
    'appsumo money',
    'Invoices expenses November',
    'Invoices income December',
    'Invoices expenses December'
  ]);
  
  const [todoTasks, setTodoTasks] = useState([
    'Event ghost for move/create/resize',
    'Saving on mobile doesnt keep layout on refre...',
    'Switching dash doesn\'t get remembered in lo...',
    'When dragging a todo into a section the enti...'
  ]);
  
  const [overdueTasks, setOverdueTasks] = useState([
    'Send invoices to accountant',
    'Move emails out of spam',
    'Clean email inbox',
    'Daily work demo',
    'Make finances snapshot'
  ]);

  const [newTodoText, setNewTodoText] = useState('');
  
  // Load saved layouts when component mounts
  useEffect(() => {
    setMounted(true);
    const savedLayouts = localStorage.getItem('dashboardLayouts');
    if (savedLayouts) {
      try {
        setLayouts(JSON.parse(savedLayouts));
      } catch (e) {
        console.error('Failed to parse saved layouts', e);
      }
    }
  }, []);
  
  // Handle layout changes
  const handleLayoutChange = (currentLayout, allLayouts) => {
    // Save layouts to state and localStorage
    setLayouts(allLayouts);
    localStorage.setItem('dashboardLayouts', JSON.stringify(allLayouts));
  };
  
  // Handle breakpoint changes
  const handleBreakpointChange = (newBreakpoint) => {
    setCurrentBreakpoint(newBreakpoint);
  };
  
  // Reset layouts to default
  const resetLayout = () => {
    setLayouts(DEFAULT_LAYOUTS);
    localStorage.removeItem('dashboardLayouts');
  };
  
  // Toggle theme
  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.className = darkTheme ? 'light-theme' : 'dark-theme';
  };
  
  // Format time for display (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Pomodoro timer controls
  const startTimer = () => setTimerActive(true);
  const pauseTimer = () => setTimerActive(false);
  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(25 * 60);
    setTimerMode('work');
  };
  
  // Toggle work mode
  const toggleWorkMode = () => setWorkMode(!workMode);
  
  // Handle task completion
  const toggleTaskCompletion = (task, sourceList) => {
    if (sourceList === 'todo') {
      setTodoTasks(todoTasks.filter(t => t !== task));
      setCompletedTasks([...completedTasks, task]);
      setPoints((prev) => prev + 10);
    } else if (sourceList === 'overdue') {
      setOverdueTasks(overdueTasks.filter(t => t !== task));
      setCompletedTasks([...completedTasks, task]);
      setPoints((prev) => prev + 5);
    } else if (sourceList === 'completed') {
      setCompletedTasks(completedTasks.filter(t => t !== task));
      setTodoTasks([...todoTasks, task]);
      setPoints((prev) => Math.max(0, prev - 10));
    }
  };
  
  // Handle adding a new todo
  const addNewTodo = (e) => {
    if (e.key === 'Enter' && newTodoText.trim()) {
      setTodoTasks([...todoTasks, newTodoText.trim()]);
      setNewTodoText('');
    }
  };
  
  // Select date in calendar
  const selectDate = (day) => {
    setSelectedDate(day);
  };
  
  // Only start rendering once component is mounted
  if (!mounted) return <div>Loading...</div>;
  
  return (
    <div className={`grid-dashboard ${darkTheme ? 'dark-theme' : 'light-theme'}`}>
      {/* Layout Controls */}
      <div className="layout-controls">
        <button className="layout-btn" onClick={resetLayout}>Reset Layout</button>
        <button className="layout-btn" onClick={toggleTheme}>
          {darkTheme ? <Sun size={16} /> : <Moon size={16} />}
          {darkTheme ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      
      {/* Responsive Grid Layout */}
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 18, md: 12, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={40}
        margin={[16, 16]}
        containerPadding={[16, 16]}
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={handleBreakpointChange}
        isDraggable={true}
        isResizable={true}
        useCSSTransforms={true}
        draggableHandle=".card-header"
      >
        {/* Pomodoro Activity */}
        <div key="pomodoroActivity">
          <DashboardCard title="Pomodoro Activity" icon={Clock}>
            <div className="flex justify-between mb-2">
              {months.map(month => (
                <span key={month} className="text-xs">{month}</span>
              ))}
            </div>
            
            <div className="grid grid-cols-28">
              {pomodoroData.map((value, i) => (
                <div 
                  key={i} 
                  className={`pomodoro-cell ${
                    value === 0 ? 'bg-gray-700' : 
                    value === 1 ? 'bg-red-500' : 
                    'bg-red-600'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-400">No pomodoros</span>
              <span className="text-xs text-gray-400">7+ pomodoros</span>
            </div>
          </DashboardCard>
        </div>
        
        {/* Calendar */}
        <div key="calendar">
          <DashboardCard title={currentMonth} icon={Calendar}>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {weekDays.map(day => (
                <div key={day} className="text-xs text-center text-gray-500">{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {days.map(day => (
                <div 
                  key={day} 
                  className={`calendar-day ${day === selectedDate ? 'today' : ''}`}
                  onClick={() => selectDate(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
        
        {/* Position */}
        <div key="position">
          <DashboardCard title="Position" icon={BarChart2} accentColor="text-yellow-500">
            <div className="flex items-center mt-2">
              <div className="ml-4 bg-blue-400 w-8 h-8 rounded-full flex items-center justify-center text-black font-bold">Z</div>
              <div className="ml-2">
                <div className="text-sm">{points} points</div>
                <div className="text-xs text-gray-400">Rank {rank} of 17</div>
              </div>
            </div>
          </DashboardCard>
        </div>
        
        {/* Work Mode */}
        <div key="workMode">
          <DashboardCard title="Work Mode" icon={Briefcase}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  className="theme-toggle-btn"
                  onClick={toggleTheme}
                  title={darkTheme ? "Switch to light theme" : "Switch to dark theme"}
                >
                  {darkTheme ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button 
                  className={`button ${workMode ? 'active' : ''}`}
                  onClick={toggleWorkMode}
                >
                  <Briefcase size={18} />
                </button>
              </div>
            </div>
          </DashboardCard>
        </div>
        
        {/* Quick Note */}
        <div key="quickNote">
          <DashboardCard title="Quick Note">
            <div className="flex flex-col">
              {isEditingNote ? (
                <input
                  type="text"
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  onBlur={() => setIsEditingNote(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingNote(false)}
                  autoFocus
                  className="input mt-2"
                />
              ) : (
                <p 
                  className="text-sm text-gray-400 cursor-pointer"
                  onClick={() => setIsEditingNote(true)}
                >
                  {quickNote}
                </p>
              )}
            </div>
          </DashboardCard>
        </div>
        
        {/* Completed Tasks */}
        <div key="completedTasks">
          <DashboardCard title="Work done today" icon={CheckCircle} accentColor="text-green-500">
            <div className="task-header">
              <span className="task-tag">work</span>
            </div>
            
            <div className="task-container">
              <ul className="task-list">
                {completedTasks.map((task, i) => (
                  <li 
                    key={i} 
                    className="task-item"
                    onClick={() => toggleTaskCompletion(task, 'completed')}
                  >
                    <CheckCircle size={16} className="mt-0.5 text-purple-500" />
                    <span className="text-sm">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </DashboardCard>
        </div>
        
        {/* Todo Tasks */}
        <div key="todoTasks">
          <DashboardCard title="Work todos today" icon={Circle} accentColor="text-blue-500">
            <div className="task-header">
              <span className="task-tag">work</span>
            </div>
            
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Quick add todo..." 
                className="input"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyDown={addNewTodo}
              />
            </div>
            
            <div className="task-container">
              <ul className="task-list">
                {todoTasks.map((task, i) => (
                  <li 
                    key={i} 
                    className="task-item"
                    onClick={() => toggleTaskCompletion(task, 'todo')}
                  >
                    <Circle size={16} className="mt-0.5 text-gray-500" />
                    <span className="text-sm">{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </DashboardCard>
        </div>
        
        {/* Overdue Tasks */}
        <div key="overdueTasks">
          <DashboardCard title="Forgotten" icon={Clock} accentColor="text-blue-500">
            <div className="task-header">
              <span className="task-tag">work</span>
            </div>
            
            <div className="subtasks">
              <div className="subtask-group">
                <div className="subtask-header">
                  <Circle size={14} className="text-gray-400" />
                  <h3 className="text-sm text-gray-400">Overplanned</h3>
                </div>
                <ul className="subtask-list">
                  <li className="subtask-item text-gray-400">
                    <span className="text-sm">Ask accountant about crypto tax</span>
                  </li>
                  <li className="subtask-item text-gray-400">
                    <span className="text-sm">manage payment details button doe...</span>
                  </li>
                </ul>
              </div>
              
              <div className="subtask-group mt-4">
                <div className="subtask-header">
                  <AlertTriangle size={14} className="text-red-500" />
                  <h3 className="text-sm text-red-500">Overdue</h3>
                </div>
                <ul className="task-list">
                  {overdueTasks.map((task, i) => (
                    <li 
                      key={i} 
                      className="task-item"
                      onClick={() => toggleTaskCompletion(task, 'overdue')}
                    >
                      <Circle size={16} className="mt-0.5 text-red-500" />
                      <span className="text-sm text-red-500">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DashboardCard>
        </div>
        
        {/* Pomodoro Counter */}
        <div key="pomodoroCounter">
          <DashboardCard title="Pomodoros" icon={Clock}>
            <div className="pomodoro-container">
              <div className="timer-mode">
                <span className="text-sm">{timerMode === 'work' ? 'Work' : 'Break'}</span>
              </div>
              
              <div className="flex justify-center">
                <div 
                  className="pomodoro-circle"
                  onClick={timerActive ? pauseTimer : startTimer}
                >
                  <span className="text-xl font-bold text-red-500">
                    {timerActive ? formatTime(timeLeft) : 'Start'}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-4">
                {timerActive ? (
                  <button onClick={pauseTimer} className="text-red-500">
                    <Pause size={20} />
                  </button>
                ) : (
                  <button onClick={startTimer} className="text-red-500">
                    <Play size={20} />
                  </button>
                )}
                {!timerActive && timeLeft !== 25 * 60 && (
                  <button onClick={resetTimer} className="text-red-500">
                    <X size={20} />
                  </button>
                )}
              </div>
              
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: 11 }, (_, i) => (
                  <div 
                    key={i} 
                    className={`pomodoro-dot ${i < completedPomodoros ? 'bg-red-500' : 'bg-gray-600'}`}
                  />
                ))}
              </div>
              <div className="text-center text-xs text-gray-400 mt-2">
                {timerActive ? 'Running' : completedPomodoros > 0 ? `${completedPomodoros} completed` : '0 min'}
              </div>
            </div>
          </DashboardCard>
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default GridDashboard;