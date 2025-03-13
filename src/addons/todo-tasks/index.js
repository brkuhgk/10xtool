/**
 * Todo Tasks Addon
 * Manage tasks that need to be completed
 */
import React, { useState, useEffect } from 'react';
import { Circle, CheckCircle, Plus, Calendar, Tag, Filter, BarChart2, Clock } from 'lucide-react';
import './styles.css';

const TodoTasks = () => {
  // State for tasks and filters
  const [todoTasks, setTodoTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTag, setNewTaskTag] = useState('work');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  
  // Sample tasks with tags, dates and priority
  const sampleTasks = [
    { id: 1, text: 'Implement dashboard layout', date: '2025-03-15', tag: 'work', completed: false, priority: 'high' },
    { id: 2, text: 'Fix responsive issues in calendar', date: '2025-03-14', tag: 'work', completed: false, priority: 'medium' },
    { id: 3, text: 'Pay quarterly taxes', date: '2025-03-20', tag: 'finance', completed: false, priority: 'high' },
    { id: 4, text: 'Send out email campaign', date: '2025-03-18', tag: 'marketing', completed: false, priority: 'medium' },
    { id: 5, text: 'Review PR for navigation changes', date: '2025-03-13', tag: 'work', completed: false, priority: 'low' },
    { id: 6, text: 'Update team availability calendar', date: '2025-03-16', tag: 'work', completed: false, priority: 'medium' }
  ];
  
  // Load tasks on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
      setTodoTasks(JSON.parse(savedTasks));
    } else {
      // Use sample tasks only if no saved tasks
      setTodoTasks(sampleTasks);
      localStorage.setItem('todoTasks', JSON.stringify(sampleTasks));
    }
  }, []);
  
  // Save tasks when they change
  useEffect(() => {
    if (todoTasks.length > 0) {
      localStorage.setItem('todoTasks', JSON.stringify(todoTasks));
    }
  }, [todoTasks]);
  
  // Filter and sort tasks
  const getFilteredTasks = () => {
    // Filter by tag
    let filtered = [...todoTasks].filter(task => !task.completed);
    
    if (filterTag !== 'all') {
      filtered = filtered.filter(task => task.tag === filterTag);
    }
    
    // Sort tasks
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'priority') {
      const priorityValue = { high: 3, medium: 2, low: 1 };
      filtered.sort((a, b) => priorityValue[b.priority] - priorityValue[a.priority]);
    } else if (sortBy === 'alphabetical') {
      filtered.sort((a, b) => a.text.localeCompare(b.text));
    }
    
    return filtered;
  };
  
  // Get unique tags from tasks
  const getUniqueTags = () => {
    const tags = todoTasks.map(task => task.tag);
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
  
  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      high: '#EF4444',
      medium: '#F59E0B',
      low: '#10B981',
      default: '#9CA3AF'
    };
    
    return colors[priority] || colors.default;
  };
  
  // Toggle task completion
  const toggleTaskCompletion = (taskId) => {
    setTodoTasks(todoTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };
  
  // Add new task
  const addTask = (e) => {
    e.preventDefault();
    
    if (!newTaskText.trim()) return;
    
    const today = new Date();
    const dueDate = newTaskDueDate || today.toISOString().split('T')[0];
    
    const newTask = {
      id: Date.now(),
      text: newTaskText,
      date: dueDate,
      tag: newTaskTag,
      completed: false,
      priority: 'medium'
    };
    
    setTodoTasks([...todoTasks, newTask]);
    setNewTaskText('');
    setNewTaskDueDate('');
    setIsAddingTask(false);
  };

  // Delete task
  const deleteTask = (taskId) => {
    setTodoTasks(todoTasks.filter(task => task.id !== taskId));
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
      return 'Today';
    }
    if (days === 1) {
      return 'Tomorrow';
    }
    return `${days}d remaining`;
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
    <div className="todo-tasks-addon">
      <div className="tasks-header">
        <div className="header-title">
          <Circle size={18} className="tasks-icon" />
          <h2 className="tasks-title">Todo Tasks</h2>
        </div>
        
        <div className="header-actions">
          <button 
            className="task-action-btn"
            onClick={() => setIsAddingTask(true)}
            title="Add task"
          >
            <Plus size={16} />
          </button>
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
                className={`filter-option ${sortBy === 'recent' ? 'active' : ''}`}
                onClick={() => setSortBy('recent')}
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
      
      {isAddingTask && (
        <form className="add-task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="New task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="task-input"
            autoFocus
          />
          
          <div className="task-form-options">
            <div className="task-form-group">
              <label className="task-form-label">
                <Calendar size={14} />
                <span>Due Date</span>
              </label>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="task-date-input"
              />
            </div>
            
            <div className="task-form-group">
              <label className="task-form-label">
                <Tag size={14} />
                <span>Tag</span>
              </label>
              <select
                value={newTaskTag}
                onChange={(e) => setNewTaskTag(e.target.value)}
                className="task-tag-select"
              >
                {getUniqueTags().filter(tag => tag !== 'all').map(tag => (
                  <option key={tag} value={tag}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="task-form-actions">
            <button type="button" className="cancel-task-btn" onClick={() => setIsAddingTask(false)}>
              Cancel
            </button>
            <button type="submit" className="add-task-btn">
              Add Task
            </button>
          </div>
        </form>
      )}
      
      <div className="tasks-container">
        {getFilteredTasks().length === 0 ? (
          <div className="no-tasks">
            <p>No tasks to show</p>
            <button 
              className="add-task-empty-btn"
              onClick={() => setIsAddingTask(true)}
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>
          </div>
        ) : (
          <ul className="tasks-list">
            {getFilteredTasks().map(task => (
              <li 
                key={task.id} 
                className={`task-item ${getTaskStatusStyle(task.date)}`}
              >
                <div className="task-check">
                  <button 
                    className="task-complete-btn"
                    onClick={() => toggleTaskCompletion(task.id)}
                    title="Mark as completed"
                  >
                    <Circle size={18} />
                  </button>
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
                      className={`task-due ${getTaskStatusStyle(task.date)}`}
                      title={formatDate(task.date)}
                    >
                      <Clock size={14} />
                      {formatDaysUntilDue(task.date)}
                    </span>
                  </div>
                </div>
                <button 
                  className="task-delete-btn"
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoTasks;