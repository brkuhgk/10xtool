/**
 * Addon Settings Service
 * Manages addon-specific settings and provides utilities for the settings modal
 */

// Import addon services
import { getAddonById, getAddonInstanceData, getAddonInstances } from './addon-manager';

/**
 * Get default settings for an addon type
 * @param {String} addonId - Base addon ID
 * @returns {Object} Default settings for this addon type
 */
export function getDefaultSettings(addonId) {
  switch (addonId) {
    case 'todoTasks':
      return {
        listName: 'Todo Tasks',
        accentColor: '#3B82F6'
      };
    
    case 'completedTasks':
      return {
        listName: 'Work done',
        accentColor: '#F59E0B',
        relatedListId: null // Auto-detect related todo list
      };
    
    case 'calendar':
      return {
        calendarColor: '#8B5CF6',
        showWeekNumbers: false
      };
    
    case 'focusMusic':
      return {
        title: 'Focus Sounds',
        accentColor: '#3B82F6',
        defaultCollection: 'nature',
        defaultDuration: 25
      };
    
    case 'mindMap':
      return {
        accentColor: '#8B5CF6',
        autoLayout: false
      };
    
    case 'workMode':
      return {
        accentColor: '#8B5CF6',
        defaultDuration: 45,
        blockNotifications: true,
        blockDistractions: true
      };
    
    case 'position':
      return {
        accentColor: '#F59E0B'
      };
    
    case 'quickNote':
      return {
        accentColor: '#8B5CF6',
        fontFamily: 'system-ui, sans-serif'
      };

    case 'pomodoroCounter':
      return {
        accentColor: '#EF4444',
        workDuration: 25,
        breakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4
      };

    case 'pomodoroActivity':
      return {
        accentColor: '#8B5CF6'
      };

    case 'overdueTasks':
      return {
        accentColor: '#EF4444',
        relatedListId: null
      };
    
    case 'ideaGenerator':
      return {
        accentColor: '#F59E0B',
        defaultCategory: 'general'
      };
    
    // Add more addon defaults as needed
    
    default:
      return {};
  }
}

/**
 * Get addon-specific setting fields for the settings modal
 * @param {String} addonId - Base addon ID
 * @param {Object} settings - Current settings
 * @param {Function} setSettings - Settings update function
 * @returns {React.Fragment|null} Component with setting fields
 */
export function getSettingsFields(addonId, settings, setSettings) {
  // Note: This is a placeholder function that returns JSX
  // In practice, you would implement this based on your UI framework
  return null;
}

/**
 * Merge default settings with user-provided settings
 * @param {String} addonId - Base addon ID
 * @param {Object} userSettings - User-provided settings
 * @returns {Object} Merged settings
 */
export function mergeWithDefaultSettings(addonId, userSettings = {}) {
  const defaultSettings = getDefaultSettings(addonId);
  return {
    ...defaultSettings,
    ...userSettings
  };
}

/**
 * Get a list of related addon instances for settings dropdowns
 * @param {String} targetAddonId - The addon ID to look for
 * @param {String} currentInstanceId - Current instance ID to exclude
 * @returns {Array} Array of { id, title } objects
 */
export function getRelatedAddonInstances(targetAddonId, currentInstanceId) {
  const instances = getAddonInstances(targetAddonId);
  
  return instances
    .filter(instanceId => instanceId !== currentInstanceId)
    .map(instanceId => {
      const instanceData = getAddonInstanceData(instanceId);
      return {
        id: instanceId,
        title: instanceData?.title || 'Unnamed Instance'
      };
    });
}

/**
 * Get validated settings for an addon instance
 * @param {String} instanceId - Instance ID
 * @returns {Object} Validated settings object
 */
export function getValidatedSettings(instanceId) {
  const instanceData = getAddonInstanceData(instanceId);
  if (!instanceData) return {};
  
  const baseAddon = getAddonById(instanceData.baseAddonId);
  if (!baseAddon) return instanceData.settings || {};
  
  // Merge with defaults and return
  return mergeWithDefaultSettings(baseAddon.id, instanceData.settings);
}

/**
 * Basic validation for settings values
 * @param {String} addonId - Base addon ID
 * @param {Object} settings - Settings to validate
 * @returns {Object} Validated settings
 */
export function validateSettings(addonId, settings) {
  const validated = { ...settings };
  
  // Addon-specific validation logic
  switch (addonId) {
    case 'pomodoroCounter':
      // Ensure durations are positive numbers
      ['workDuration', 'breakDuration', 'longBreakDuration'].forEach(key => {
        if (validated[key] !== undefined) {
          const value = parseInt(validated[key]);
          validated[key] = isNaN(value) || value <= 0 ? getDefaultSettings(addonId)[key] : value;
        }
      });
      break;
      
    case 'focusMusic':
      // Ensure defaultDuration is a positive number
      if (validated.defaultDuration !== undefined) {
        const value = parseInt(validated.defaultDuration);
        validated.defaultDuration = isNaN(value) || value <= 0 ? 
          getDefaultSettings(addonId).defaultDuration : value;
      }
      break;
    
    // Add more validation as needed for other addons
  }
  
  return validated;
}

/**
 * Exports an object with addon names mapped to their setting schemas and UI components
 * This can be used in the settings modal to dynamically render fields
 */
export const ADDON_SETTINGS_CONFIG = {
  todoTasks: {
    fields: [
      { name: 'listName', type: 'text', label: 'List Name', placeholder: 'My Tasks' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' }
    ]
  },
  
  completedTasks: {
    fields: [
      { name: 'listName', type: 'text', label: 'List Name', placeholder: 'Work done' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { 
        name: 'relatedListId', 
        type: 'select', 
        label: 'Related Todo List',
        options: [], // Populated dynamically with getRelatedAddonInstances
        placeholder: 'Select a Todo List' 
      }
    ]
  },
  
  calendar: {
    fields: [
      { name: 'calendarColor', type: 'color', label: 'Calendar Color' },
      { name: 'showWeekNumbers', type: 'checkbox', label: 'Show Week Numbers' }
    ]
  },
  
  focusMusic: {
    fields: [
      { name: 'title', type: 'text', label: 'Title', placeholder: 'Focus Sounds' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { 
        name: 'defaultCollection', 
        type: 'select', 
        label: 'Default Collection',
        options: [
          { value: 'nature', label: 'Nature' },
          { value: 'ambient', label: 'Ambient' },
          { value: 'noise', label: 'Noise' },
          { value: 'cafe', label: 'Cafe' }
        ]
      },
      { 
        name: 'defaultDuration', 
        type: 'select', 
        label: 'Default Timer Duration',
        options: [
          { value: 5, label: '5 minutes' },
          { value: 15, label: '15 minutes' },
          { value: 25, label: '25 minutes' },
          { value: 30, label: '30 minutes' },
          { value: 45, label: '45 minutes' },
          { value: 60, label: '60 minutes' }
        ]
      }
    ]
  },
  
  // Add more addon configurations as needed
};