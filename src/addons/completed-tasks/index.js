/**
 * Completed Tasks Addon
 * View and manage completed tasks
 */
import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Filter, Calendar, BarChart2, Tag } from 'lucide-react';
import './styles.css';

const CompletedTasks = () => {
  // State for tasks and filters
  const [completedTasks, setCompletedTasks] = useState([]);
  const [filterTag, setFilterTag] = useState('all');
  const [filterDate, setFilterDate] = useState('today');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  
  // Sample tasks with tags, dates and points
  const sampleTasks = [
    { id: 1, text: 'Calendar fix', date: '2025-03-11', tag: 'work', points: 10 },
    { id: 2, text: 'Figure out customer Sizzy subscriptions that...', date: '2025-03-11', tag: 'work', points: 15 },
    { id: 3, text: 'Pay for hirezify.io', date: '2025-03-11', tag: 'finance', points: 5 },
    { id: 4, text: 'Ship new landing page vs todoist etc', date: '2025-03-11', tag: 'marketing', points: 25 },
    { id: 5, text: 'Menus don\'t have bg on vaul', date: '2025-03-11', tag: 'work', points: 15 },
    { id: 6, text: 'See why users cannot send pass reset email...', date: '2025-03-11', tag: 'support', points: 20 },
    { id: 7, text: 'benji email verification doesn\'t work', date: '2025-03-11', tag: 'work', points: 15 },
    { id: 8, text: 'Pay mailgun', date: '2025-03-11', tag: 'finance', points: 5 },
    { id: 9, text: 'Text accountant', date: '2025-03-10', tag: 'finance', points: 5 },
    { id: 10, text: 'Sizzy downloads for apple silicon', date: '2025-03-10', tag: 'work', points: 15 },
    { id: 11, text: 'Refund customer', date: '2025-03-10', tag: 'support', points: 10 },
    { id: 12, text: 'fix guy\'s sub on benji', date: '2025-03-10', tag: 'support', points: 15 },
    { id: 13, text: 'Move benji to coolify', date: '2025-03-09', tag: 'work', points: 20 },
    { id: 14, text: 'Deploy glink', date: '2025-03-09', tag: 'work', points: 15 },
    { id: 15, text: 'Make sure ppl can buy sizzy', date: '2025-03-09', tag: 'work', points: 20 },
    { id: 16, text: 'Sizzy new subs don\'t load', date: '2025-03-09', tag: 'work', points: 15 },
    { id: 17, text: 'Pay PIT for Nov/Dec', date: '2025-03-08', tag: 'finance', points: 10 },
    { id: 18, text: 'Finalize taxes with accountant', date: '2025-03-08', tag: 'finance', points: 20 },
    { id: 19, text: 'see PIT email', date: '2025-03-08', tag: 'finance', points: 5 },
    { id: 20, text: 'appsumo money', date: '2025-03-07', tag: 'finance', points: 10 },
    { id: 21, text: 'Invoices expenses November', date: '2025-03-07', tag: 'finance', points: 15 },
    { id: 22, text: 'Invoices income December', date: '2025-03-07', tag: 'finance', points: 15 },
    { id: 23, text: 'Invoices expenses December', date: '2025-03-07', tag: 'finance', points: 15 }
  ];
  
  // Load tasks on mount
  useEffect(() => {
    // In a real app, you would load from API or localStorage
    setCompletedTasks(sampleTasks);
  }, []);
  
  // Filter and sort tasks
  const getFilteredTasks = () => {
    // Filter by date
    let filtered = [...completedTasks];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    
    if (filterDate === 'today') {
      const todayStr = today.toISOString().split('T')[0];
      filtered = filtered.filter(task => task.date === todayStr);
    } else if (filterDate === 'yesterday') {
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      filtered = filtered.filter(task => task.date === yesterdayStr);
    } else if (filterDate === 'thisWeek') {
      filtered = filtered.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= thisWeekStart && taskDate <= today;
      });
    }
    
    // Filter by tag
    if (filterTag !== 'all') {
      filtered = filtered.filter(task => task.tag === filterTag);
    }
    
    // Sort tasks
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'points') {
      filtered.sort((a, b) => b.points - a.points);
    } else if (sortBy === 'alphabetical') {
      filtered.sort((a, b) => a.text.localeCompare(b.text));
    }
    
    return filtered;
  };
  
  // Get unique tags from tasks
  const getUniqueTags = () => {
    const tags = completedTasks.map(task => task.tag);
    return ['all', ...new Set(tags)];
  };
  
  // Get tag color
  const getTagColor = (tag) => {
    const colors = {
      work: '#8B5CF6',
      finance: '#10B981',
      support: '#3B82F6',
      marketing: '#F59E0B',
      default: '#9CA3AF'
    };
    
    return colors[tag] || colors.default;
  };
  
  // Toggle completed state (move back to todo)
  const toggleTaskCompletion = (taskId) => {
    // In a real app, you would move this task back to todo list
    setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
  };
  
  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Format task count
  const formatTaskCount = () => {
    const filteredTasks = getFilteredTasks();
    return `${filteredTasks.length} ${filteredTasks.length === 1 ? 'task' : 'tasks'}`;
  };
  
  // Calculate total points
  const calculateTotalPoints = () => {
    return getFilteredTasks().reduce((total, task) => total + task.points, 0);
  };
  
  // Toggle filters panel
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="completed-tasks-addon">
      <div className="tasks-header">
        <div className="header-title">
          <CheckCircle size={18} className="tasks-icon" />
          <h2 className="tasks-title">Work done</h2>
        </div>
        
        <div className="header-actions">
          <span className="tag-badge work">work</span>
          <button 
            className="filter-btn"
            onClick={toggleFilters}
          >
            <Filter size={16} />
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-section">
            <div className="filter-label">
              <Calendar size={14} />
              <span>Time Period</span>
            </div>
            <div className="filter-options">
              <button 
                className={`filter-option ${filterDate === 'today' ? 'active' : ''}`}
                onClick={() => setFilterDate('today')}
              >
                Today
              </button>
              <button 
                className={`filter-option ${filterDate === 'yesterday' ? 'active' : ''}`}
                onClick={() => setFilterDate('yesterday')}
              >
                Yesterday
              </button>
              <button 
                className={`filter-option ${filterDate === 'thisWeek' ? 'active' : ''}`}
                onClick={() => setFilterDate('thisWeek')}
              >
                This Week
              </button>
              <button 
                className={`filter-option ${filterDate === 'all' ? 'active' : ''}`}
                onClick={() => setFilterDate('all')}
              >
                All Time
              </button>
            </div>
          </div>
          
          <div className="filter-section">
            <div className="filter-label">
              <Tag size={14} />
              <span>Tag</span>
            </div>
            <div className="filter-options">
              {getUniqueTags().map(tag => (
                <button 
                  key={tag}
                  className={`filter-option ${filterTag === tag ? 'active' : ''}`}
                  onClick={() => setFilterTag(tag)}
                  style={tag !== 'all' ? { color: getTagColor(tag) } : {}}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-section">
            <div className="filter-label">
              <BarChart2 size={14} />
              <span>Sort By</span>
            </div>
            <div className="filter-options">
              <button 
                className={`filter-option ${sortBy === 'recent' ? 'active' : ''}`}
                onClick={() => setSortBy('recent')}
              >
                Most Recent
              </button>
              <button 
                className={`filter-option ${sortBy === 'points' ? 'active' : ''}`}
                onClick={() => setSortBy('points')}
              >
                Highest Points
              </button>
              <button 
                className={`filter-option ${sortBy === 'alphabetical' ? 'active' : ''}`}
                onClick={() => setSortBy('alphabetical')}
              >
                Alphabetical
              </button>
            </div>
          </div>
          
          <div className="filter-footer">
            <div className="filter-stats">
              <span>{formatTaskCount()}</span>
              <span>{calculateTotalPoints()} points</span>
            </div>
            <button 
              className="close-filters-btn"
              onClick={toggleFilters}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      <div className="tasks-container">
        <ul className="tasks-list">
          {getFilteredTasks().map(task => (
            <li 
              key={task.id} 
              className="task-item"
              onClick={() => toggleTaskCompletion(task.id)}
            >
              <div className="task-check">
                <CheckCircle size={16} className="task-icon" style={{ color: getTagColor(task.tag) }} />
              </div>
              <div className="task-content">
                <div className="task-text">{task.text}</div>
                <div className="task-meta">
                  <span className="task-date">{formatDate(task.date)}</span>
                  <span className="task-points">+{task.points} pts</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompletedTasks;