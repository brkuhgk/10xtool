import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Plus, RotateCcw, Save, Moon, Sun, Settings, Trash2 } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './GridDashboard.css';
import ErrorBoundary from '../components/ErrorBoundary';

// Import addon services
import {
  initializeAddonManager,
  getAvailableAddons,
  getAddonById,
  getActiveAddons,
  addAddonToDashboard,
  removeAddonFromDashboard,
  getDefaultLayout,
  saveUserLayout,
  loadUserLayout,
  resetUserLayout,
  getAddonInstanceData,
  updateAddonInstance
} from '../services/addon-manager';

// Import grid configuration
import { GRID_CONFIG } from '../services/layout-constants';

// Import addons registry
import ADDONS from '../addons';

// Initialize addon manager
initializeAddonManager(ADDONS);

// Create responsive grid layout with width provider
const ResponsiveGridLayout = WidthProvider(Responsive);

// Dashboard Controls Component
const DashboardControls = ({ 
  onAddClick, 
  onResetClick, 
  onSaveClick, 
  onThemeToggle, 
  darkTheme 
}) => {
  return (
    <div className="dashboard-controls">
      <div className="control-group">
        <button
          className="control-btn add-btn" 
          onClick={onAddClick} 
          title="Add new addon"
        >
          <Plus size={16} className="btn-icon" />
          <span className="btn-text">Add</span>
        </button>
        
        <button 
          className="control-btn reset-btn" 
          onClick={onResetClick} 
          title="Reset layout"
        >
          <RotateCcw size={16} className="btn-icon" />
          <span className="btn-text">Reset</span>
        </button>
        
        <button 
          className="control-btn save-btn" 
          onClick={onSaveClick} 
          title="Save layout"
        >
          <Save size={16} className="btn-icon" />
          <span className="btn-text">Save</span>
        </button>
      </div>
      
      <div className="control-group">
        <button 
          className="control-btn theme-btn" 
          onClick={onThemeToggle} 
          title={darkTheme ? "Switch to light theme" : "Switch to dark theme"}
        >
          {darkTheme ? <Sun size={16} className="btn-icon" /> : <Moon size={16} className="btn-icon" />}
          <span className="btn-text">{darkTheme ? "Light" : "Dark"}</span>
        </button>
      </div>
    </div>
  );
};

// Dashboard Card Component with direct delete functionality
const DashboardCard = ({ 
  title, 
  icon: Icon, 
  children, 
  onRemove, 
  onEdit, 
  id, 
  customizable = false 
}) => {
  const handleRemove = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (onRemove) {
      onRemove(id); // Call remove directly without confirmation
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (onEdit) {
      onEdit(id);
    }
  };

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div className="card-title">
          {Icon && <Icon size={18} className="card-icon" />}
          <h2>{title}</h2>
        </div>
        <div className="card-actions">
          {customizable && (
            <button 
              className="card-action-btn" 
              onClick={handleEdit} 
              title="Edit"
            >
              <Settings size={14} />
            </button>
          )}
          {onRemove && (
            <button 
              className="card-remove-btn" 
              onClick={handleRemove} 
              title="Remove"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

// Addon Picker Component
const AddonPicker = ({ onAddAddon, onClose }) => {
  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const addons = getAvailableAddons();
  
  // Get unique categories
  const getCategories = () => {
    const categories = addons.map(addon => addon.category);
    return ['all', ...new Set(categories)];
  };
  
  // Filter addons by search term and category
  const filteredAddons = addons.filter(addon => {
    // Filter by search term
    const searchMatch = addon.name.toLowerCase().includes(filter.toLowerCase()) ||
                        addon.description.toLowerCase().includes(filter.toLowerCase());
    
    // Filter by category
    const categoryMatch = selectedCategory === 'all' || addon.category === selectedCategory;
    
    return searchMatch && categoryMatch;
  });
  
  return (
    <div className="addon-picker">
      <div className="picker-header">
        <h2>Add Addon</h2>
        <button className="picker-close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="picker-search">
        <input
          type="text"
          placeholder="Search addons..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="picker-search-input"
        />
      </div>
      
      <div className="picker-categories">
        {getCategories().map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="picker-addons">
        {filteredAddons.length === 0 ? (
          <div className="no-addons">No addons found</div>
        ) : (
          filteredAddons.map(addon => (
            <div 
              key={addon.id}
              className="addon-item"
              onClick={() => {
                onAddAddon(addon.id);
                onClose();
              }}
            >
              <div className="addon-item-icon">
                <addon.icon size={20} />
              </div>
              <div className="addon-item-info">
                <h3>{addon.name}</h3>
                <p>{addon.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Addon Settings Modal Component
const AddonSettings = ({ instanceId, onClose, onSave }) => {
  // Initialize state with default empty values
  const [title, setTitle] = useState('');
  const [settings, setSettings] = useState({});
  const [addonName, setAddonName] = useState('');
  const [addonId, setAddonId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load instance data and addon info when component mounts or instanceId changes
  useEffect(() => {
    try {
      const data = getAddonInstanceData(instanceId);
      const addon = getAddonById(instanceId);
      
      if (!data || !addon) {
        setError('Could not find addon data');
        setIsLoading(false);
        return;
      }
      
      // Update state with the loaded data
      setTitle(data.title || addon.name);
      setSettings(data.settings || {});
      setAddonName(addon.name);
      setAddonId(addon.id);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading addon settings:', err);
      setError('Error loading settings');
      setIsLoading(false);
    }
  }, [instanceId]);
  
  // Handle save action
  const handleSave = () => {
    onSave(instanceId, { title, settings });
    onClose();
  };
  
  // Get addon-specific settings fields if the addon defines them
  const renderAddonSpecificSettings = () => {
    // Basic implementation - can be extended to support more dynamic settings
    if (addonId === 'todoTasks') {
      return (
        <div className="settings-group">
          <label htmlFor="list-name">List Name</label>
          <input
            id="list-name"
            type="text"
            value={settings.listName || ''}
            onChange={(e) => setSettings({...settings, listName: e.target.value})}
            className="settings-input"
            placeholder="My Tasks"
          />
        </div>
      );
    }
    
    if (addonId === 'calendar') {
      return (
        <div className="settings-group">
          <label htmlFor="calendar-color">Calendar Color</label>
          <input
            id="calendar-color"
            type="color"
            value={settings.calendarColor || '#8B5CF6'}
            onChange={(e) => setSettings({...settings, calendarColor: e.target.value})}
            className="settings-color-input"
          />
        </div>
      );
    }
    
    return null;
  };
  
  // Show loading or error state
  if (isLoading) {
    return (
      <div className="addon-settings">
        <div className="settings-header">
          <h2>Loading...</h2>
          <button className="settings-close-btn" onClick={onClose}>×</button>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="addon-settings">
        <div className="settings-header">
          <h2>Error</h2>
          <button className="settings-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="settings-content">
          <p>{error}</p>
        </div>
        <div className="settings-footer">
          <button className="cancel-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="addon-settings">
      <div className="settings-header">
        <h2>Edit {addonName}</h2>
        <button className="settings-close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="settings-content">
        <div className="settings-group">
          <label htmlFor="addon-title">Title</label>
          <input
            id="addon-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="settings-input"
          />
        </div>
        
        {/* Render addon-specific settings */}
        {renderAddonSpecificSettings()}
      </div>
      
      <div className="settings-footer">
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
        <button className="save-btn" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

// Main GridDashboard Component
const GridDashboard = () => {
  // State for layouts (responsive)
  const [layouts, setLayouts] = useState(null);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const [mounted, setMounted] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);
  const [showAddonPicker, setShowAddonPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingAddon, setEditingAddon] = useState(null);
  const [activeAddons, setActiveAddons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
  const [showUndoNotification, setShowUndoNotification] = useState(false);
  
  // Load saved layouts when component mounts
  useEffect(() => {
    setMounted(true);
    
    try {
      // Load active addons
      const addons = getActiveAddons();
      setActiveAddons(addons);
      
      // Load saved layouts
      const savedLayouts = loadUserLayout();
      if (savedLayouts) {
        setLayouts(savedLayouts);
      } else {
        // Use default layouts
        const defaultLayouts = {
          lg: getDefaultLayout('lg'),
          md: getDefaultLayout('md'),
          sm: getDefaultLayout('sm')
        };
        
        // Add layouts for any addons that aren't in default layout
        addons.forEach(addonId => {
          const addon = getAddonById(addonId);
          if (addon) {
            Object.keys(defaultLayouts).forEach(breakpoint => {
              // Check if addon is already in layout
              const exists = defaultLayouts[breakpoint].some(item => item.i === addonId);
              if (!exists) {
                // Find position for new addon
                const nextPosition = findNextAvailablePosition(defaultLayouts[breakpoint]);
                
                // Add to layout
                defaultLayouts[breakpoint].push({
                  i: addonId,
                  x: nextPosition.x,
                  y: nextPosition.y,
                  w: addon.defaultSize?.w || 6,
                  h: addon.defaultSize?.h || 6,
                  minW: addon.defaultSize?.minW || 3,
                  minH: addon.defaultSize?.minH || 3
                });
              }
            });
          }
        });
        
        setLayouts(defaultLayouts);
        // Save the default layouts to localStorage
        saveUserLayout(defaultLayouts);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      // Reset to defaults if there was an error
      resetUserLayout();
      setLayouts({
        lg: getDefaultLayout('lg'),
        md: getDefaultLayout('md'),
        sm: getDefaultLayout('sm')
      });
    } finally {
      setIsLoading(false);
    }
    
    // Set theme class on body
    document.body.className = darkTheme ? 'dark-theme' : 'light-theme';
  }, []);
  
  // Apply theme changes
  useEffect(() => {
    document.body.className = darkTheme ? 'dark-theme' : 'light-theme';
  }, [darkTheme]);
  
  // Handle layout changes
  const handleLayoutChange = (currentLayout, allLayouts) => {
    // Save layouts to state and localStorage
    setLayouts(allLayouts);
    saveUserLayout(allLayouts);
  };
  
  // Handle breakpoint changes
  const handleBreakpointChange = (newBreakpoint) => {
    setCurrentBreakpoint(newBreakpoint);
  };
  
  // Reset layouts to default
  const resetLayout = () => {
    if (window.confirm("Are you sure you want to reset the dashboard? This will remove all your customizations.")) {
      resetUserLayout();
      // Reload page to reset everything
      window.location.reload();
    }
  };
  
  // Toggle theme
  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  // Find next available position for a new addon
  const findNextAvailablePosition = (layout) => {
    if (!layout || !Array.isArray(layout) || layout.length === 0) {
      return { x: 0, y: 0 };
    }
    
    // Find the maximum y-coordinate plus height
    const maxY = Math.max(...layout.map(item => item.y + item.h), 0);
    return { x: 0, y: maxY };
  };
  
  // Add addon to dashboard
  const handleAddAddon = (addonId) => {
    try {
      const instanceId = addAddonToDashboard(addonId);
      
      if (instanceId) {
        // Update active addons
        setActiveAddons(getActiveAddons());
        
        // Update layouts if needed
        const addon = getAddonById(instanceId);
        if (addon && layouts) {
          const newLayouts = { ...layouts };
          
          // Find a good position for the new addon
          const nextPosition = findNextAvailablePosition(layouts[currentBreakpoint] || []);
          
          // Add to all breakpoints
          Object.keys(newLayouts).forEach(breakpoint => {
            if (!Array.isArray(newLayouts[breakpoint])) {
              newLayouts[breakpoint] = [];
            }
            
            newLayouts[breakpoint].push({
              i: instanceId,
              x: nextPosition.x,
              y: nextPosition.y,
              w: addon.defaultSize?.w || 6,
              h: addon.defaultSize?.h || 6,
              minW: addon.defaultSize?.minW || 3,
              minH: addon.defaultSize?.minH || 3
            });
          });
          
          setLayouts(newLayouts);
          saveUserLayout(newLayouts);
        }
      }
    } catch (error) {
      console.error("Error adding addon:", error);
      alert("Failed to add addon. Please try again.");
    }
  };
  
  // Remove addon from dashboard without confirmation - with undo capability
  const handleRemoveAddon = (instanceId) => {
    try {
      // Store the addon data for potential undo
      const addonToDelete = {
        instanceId,
        instanceData: getAddonInstanceData(instanceId),
        layoutPositions: {}
      };
      
      // Store layout positions for all breakpoints
      if (layouts) {
        Object.keys(layouts).forEach(breakpoint => {
          const layoutItem = layouts[breakpoint].find(item => item.i === instanceId);
          if (layoutItem) {
            addonToDelete.layoutPositions[breakpoint] = { ...layoutItem };
          }
        });
      }
      
      // Create a new reference of the layouts object to ensure React detects the change
      const layoutsCopy = JSON.parse(JSON.stringify(layouts));
      
      // Remove the addon from all breakpoints directly
      Object.keys(layoutsCopy).forEach(breakpoint => {
        layoutsCopy[breakpoint] = layoutsCopy[breakpoint].filter(item => item.i !== instanceId);
      });
      
      // Remove from addon manager
      removeAddonFromDashboard(instanceId);
      
      // Update the state with the new layouts
      setLayouts(layoutsCopy);
      saveUserLayout(layoutsCopy);
      
      // Update active addons state
      setActiveAddons(getActiveAddons());
      
      // Set recently deleted for undo functionality
      setRecentlyDeleted(addonToDelete);
      setShowUndoNotification(true);
      
      // Auto-hide the undo notification after 5 seconds
      setTimeout(() => {
        setShowUndoNotification(false);
      }, 5000);
    } catch (error) {
      console.error("Error removing addon:", error);
      alert("Failed to remove addon. Please try again.");
    }
  };
  
  // Handle undo functionality to restore recently deleted addon
  const handleUndo = () => {
    if (!recentlyDeleted) return;
    
    try {
      const { instanceId, instanceData, layoutPositions } = recentlyDeleted;
      
      // Re-add the addon instance to the addon manager
      const activeAddons = getActiveAddons();
      activeAddons.push(instanceId);
      localStorage.setItem('activeAddons', JSON.stringify(activeAddons));
      
      // Restore the instance data
      const addonInstances = JSON.parse(localStorage.getItem('addonInstances') || '{}');
      addonInstances[instanceId] = instanceData;
      localStorage.setItem('addonInstances', JSON.stringify(addonInstances));
      
      // Restore layouts
      if (layouts) {
        const updatedLayouts = { ...layouts };
        
        Object.keys(updatedLayouts).forEach(breakpoint => {
          if (layoutPositions[breakpoint]) {
            updatedLayouts[breakpoint].push(layoutPositions[breakpoint]);
          }
        });
        
        setLayouts(updatedLayouts);
        saveUserLayout(updatedLayouts);
      }
      
      // Update active addons
      setActiveAddons(getActiveAddons());
      
      // Clear undo state
      setRecentlyDeleted(null);
      setShowUndoNotification(false);
    } catch (error) {
      console.error("Error undoing deletion:", error);
      alert("Failed to restore addon. Please try again.");
    }
  };
  
  // Edit addon settings
  const handleEditAddon = (instanceId) => {
    setEditingAddon(instanceId);
    setShowSettings(true);
  };
  
  // Save addon settings
  const handleSaveSettings = (instanceId, data) => {
    try {
      if (updateAddonInstance(instanceId, data)) {
        // Update active addons to trigger re-render
        setActiveAddons([...getActiveAddons()]);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };
  
  // Render addon component
  const renderAddon = (instanceId) => {
    try {
      const baseAddon = getAddonById(instanceId);
      const instanceData = getAddonInstanceData(instanceId);
      
      if (!baseAddon) return (
        <div className="error-message">Addon not found</div>
      );
      
      const AddonComponent = baseAddon.component;
      const customTitle = instanceData?.title || baseAddon.name;
      
      // Pass instance-specific settings to the component
      const addonSettings = instanceData?.settings || {};
      
      return (
        <DashboardCard 
          title={customTitle}
          icon={baseAddon.icon}
          id={instanceId}
          onRemove={handleRemoveAddon}
          onEdit={handleEditAddon}
          customizable={true}
        >
          <ErrorBoundary
            fallback={(error) => (
              <div className="error-message">
                <h4>Error in addon</h4>
                <p>{error?.message || 'An unknown error occurred'}</p>
                <button onClick={() => handleRemoveAddon(instanceId)}>Remove</button>
              </div>
            )}
          >
            <AddonComponent settings={addonSettings} instanceId={instanceId} />
          </ErrorBoundary>
        </DashboardCard>
      );
    } catch (error) {
      console.error(`Error rendering addon ${instanceId}:`, error);
      return (
        <DashboardCard 
          title="Error"
          id={instanceId}
          onRemove={handleRemoveAddon}
        >
          <div className="error-message">
            Failed to load this addon. <button onClick={() => handleRemoveAddon(instanceId)}>Remove</button>
          </div>
        </DashboardCard>
      );
    }
  };
  
  // Undo notification component
  const UndoNotification = () => {
    if (!showUndoNotification) return null;
    
    return (
      <div className="undo-notification">
        <span>Addon removed</span>
        <button onClick={handleUndo}>Undo</button>
      </div>
    );
  };
  
  // Only start rendering once component is mounted and layouts are loaded
  if (!mounted || !layouts) {
    return (
      <div className="loading">
        {isLoading ? "Loading..." : "Error loading dashboard. Please refresh the page."}
      </div>
    );
  }
  
  return (
    <div className={`grid-dashboard ${darkTheme ? 'dark-theme' : 'light-theme'}`}>
      {/* Layout Controls */}
      <DashboardControls
        onAddClick={() => setShowAddonPicker(true)}
        onResetClick={resetLayout}
        onSaveClick={() => saveUserLayout(layouts)}
        onThemeToggle={toggleTheme}
        darkTheme={darkTheme}
      />
      
      {/* Addon Picker Modal */}
      {showAddonPicker && (
        <div className="modal-overlay">
          <AddonPicker 
            onAddAddon={handleAddAddon} 
            onClose={() => setShowAddonPicker(false)} 
          />
        </div>
      )}
      
      {/* Addon Settings Modal */}
      {showSettings && (
        <div className="modal-overlay">
          <AddonSettings 
            instanceId={editingAddon}
            onClose={() => {
              setShowSettings(false);
              setEditingAddon(null);
            }}
            onSave={handleSaveSettings}
          />
        </div>
      )}
      
      {/* Responsive Grid Layout */}
      <ResponsiveGridLayout
        className="dashboard-layout"
        layouts={layouts}
        breakpoints={GRID_CONFIG.breakpoints}
        cols={GRID_CONFIG.cols}
        rowHeight={GRID_CONFIG.rowHeight}
        margin={GRID_CONFIG.margin}
        containerPadding={GRID_CONFIG.containerPadding}
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={handleBreakpointChange}
        draggableHandle=".card-header"
        resizeHandles={['se']}
      >
        {activeAddons.map(instanceId => (
          <div key={instanceId}>
            {renderAddon(instanceId)}
          </div>
        ))}
      </ResponsiveGridLayout>
      
      {/* Undo Notification */}
      <UndoNotification />
    </div>
  );
};

export default GridDashboard;