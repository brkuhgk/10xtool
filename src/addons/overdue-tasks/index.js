/**
 * Overdue Tasks Addon
 * Track tasks that need attention
 */
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Filter, BarChart2, Clock, Tag, CheckCircle, Bell } from 'lucide-react';
import './styles.css';

const OverdueTasks = () => {
  // State for filters
  const [filterTag, setFilterTag] = useState('all');
  const [sortBy, setSortBy] = useState('overdue');
  const [showFilters, setShowFilters] = useState(false);
  const [overdueTasks, setOverdueTasks] = useState([]);
  
  // Load tasks from localStorage on mount
  useEffect(() => {
    // Get all tasks from localStorage
    const todoTasks = localStorage.getItem('todoTasks');
    const completedTasks = localStorage.getItem('completedTasks');
    
    let allTasks = [];
    
    if (todoTasks) {
      allTasks = [...JSON.parse(todoTasks)];
    }
    
    if (completedTasks) {
      allTasks = [...allTasks, ...JSON.parse(completedTasks)];
    }
    
    // Filter only overdue and upcoming tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueAndUpcoming = allTasks.filter(task => {
      if (task.completed) return false;
      
      const dueDate = new Date(task.date);
      dueDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      
      // Include if overdue or due within 3 days
      return diffDays <= 3;
    });
    
    setOverdueTasks(overdueAndUpcoming);
  }, []);
  
  // Filter and sort tasks
  const getFilteredTasks = () => {
    // Filter by tag
    let filtered = [...overdueTasks];
    
    if (filterTag !== 'all') {
      filtered = filtered.filter(task => task.tag === filterTag);
    }
    
    // Sort tasks
    if (sortBy === 'overdue') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'priority') {
      const priorityValue = { high: 3, medium: 2, low: 1 };
      filtered.sort((a, b) => priorityValue[b.priority || 'medium'] - priorityValue[a.priority || 'medium']);
    } else if (sortBy === 'alphabetical') {
      filtered.sort((a, b) => a.text.localeCompare(b.text));
    }
    
    return filtered;
  };
  
  // Get unique tags from tasks
  const getUniqueTags = () => {
    const tags = overdueTasks.map(task => task.tag);
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
  
  // Get priority color and icon
  const getPriorityInfo = (priority) => {
    const info = {
      high: { color: '#EF4444', icon: <AlertTriangle size={12} /> },
      medium: { color: '#F59E0B', icon: <Bell size={12} /> },
      low: { color: '#10B981', icon: null },
      default: { color: '#9CA3AF', icon: null }
    };
    
    return info[priority] || info.default;
  };
  
  // Toggle task completion
  const completeTask = (taskId) => {
    // Update local state
    setOverdueTasks(overdueTasks.filter(task => task.id !== taskId));
    
    // Also update in localStorage
    const todoTasks = localStorage.getItem('todoTasks');
    if (todoTasks) {
      const tasks = JSON.parse(todoTasks);
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex !== -1) {
        // Mark as completed
        tasks[taskIndex].completed = true;
        
        // Save back to localStorage
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
        
        // Also add to completed tasks if that exists
        const completedTasks = localStorage.getItem('completedTasks');
        if (completedTasks) {
          const completed = JSON.parse(completedTasks);
          completed.push(tasks[taskIndex]);
          localStorage.setItem('completedTasks', JSON.stringify(completed));
        }
      }
    }
  };
  
  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Calculate days until due
  const getDaysUntilDue = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Format days until due as text
  const formatDaysUntilDue = (dateStr) => {
    const days = getDaysUntilDue(dateStr);
    
    if (days < 0) {
      return `${Math.abs(days)}d overdue`;
    }
    if (days === 0) {
      return `Due today`;
    }
    if (days === 1) {
      return `Due tomorrow`;
    }
    return `Due in ${days}d`;
  };
  
  // Get status style for task
  const getTaskStatusStyle = (dateStr) => {
    const days = getDaysUntilDue(dateStr);
    
    if (days < 0) {
      return 'overdue';
    }
    if (days === 0) {
      return 'due-today';
    }
    if (days <= 2) {
      return 'due-soon';
    }
    return '';
  };
  
  // Toggle filters panel
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="overdue-tasks-addon">
      <div className="tasks-header">
        <div className="header-title">
          <AlertTriangle size={18} className="tasks-icon" />
          <h2 className="tasks-title">Overdue Tasks</h2>
        </div>
        
        <div className="header-actions">
          <button 
            className="task-action-btn"
            onClick={toggleFilters}
            title="Filter tasks"
          >
            <Filter size={16} />
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="filter-panel">
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
                className={`filter-option ${sortBy === 'overdue' ? 'active' : ''}`}
                onClick={() => setSortBy('overdue')}
              >
                Due Date
              </button>
              <button 
                className={`filter-option ${sortBy === 'priority' ? 'active' : ''}`}
                onClick={() => setSortBy('priority')}
              >
                Priority
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
        {getFilteredTasks().length === 0 ? (
          <div className="no-tasks">
            <AlertTriangle size={32} className="no-tasks-icon" />
            <p>No overdue or upcoming tasks</p>
          </div>
        ) : (
          <ul className="tasks-list">
            {getFilteredTasks().map(task => {
              const taskStatus = getTaskStatusStyle(task.date);
              const priorityInfo = getPriorityInfo(task.priority || 'medium');
              
              return (
                <li 
                  key={task.id} 
                  className={`task-item ${taskStatus}`}
                >
                  <div className="task-priority">
                    {taskStatus === 'overdue' ? (
                      <AlertTriangle size={16} className="priority-icon overdue" />
                    ) : priorityInfo.icon}
                  </div>
                  <div className="task-content">
                    <div className="task-text">{task.text}</div>
                    <div className="task-meta">
                      <span 
                        className="task-tag"
                        style={{ backgroundColor: `${getTagColor(task.tag)}20`, color: getTagColor(task.tag) }}
                      >
                        {task.tag}
                      </span>
                      <span 
                        className={`task-due ${taskStatus}`}
                        title={formatDate(task.date)}
                      >
                        <Clock size={14} />
                        {formatDaysUntilDue(task.date)}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="task-complete-btn"
                    onClick={() => completeTask(task.id)}
                    title="Mark as completed"
                  >
                    <CheckCircle size={18} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OverdueTasks;