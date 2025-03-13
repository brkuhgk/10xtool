/**
 * Enhanced Addon Manager Service
 * Manages addon registration, instantiation and dashboard layout
 */

// Default active addons and layouts storage keys
const STORAGE_KEYS = {
  ACTIVE_ADDONS: 'activeAddons',
  LAYOUTS: 'dashboardLayouts',
  ADDON_INSTANCES: 'addonInstances'
};

// Private variables
let _addonRegistry = [];
let _activeAddons = [];
let _addonInstances = {};

/**
 * Initialize addon manager with registry
 * @param {Array} addonRegistry - Array of available addons
 */
export function initializeAddonManager(addonRegistry) {
  if (!addonRegistry || !Array.isArray(addonRegistry)) {
    console.error('Invalid addon registry provided');
    _addonRegistry = [];
    return;
  }
  
  _addonRegistry = addonRegistry;
  
  try {
    // Load active addons from localStorage
    const savedAddons = localStorage.getItem(STORAGE_KEYS.ACTIVE_ADDONS);
    if (savedAddons) {
      _activeAddons = JSON.parse(savedAddons);
    }
    
    // Load addon instances from localStorage
    const savedInstances = localStorage.getItem(STORAGE_KEYS.ADDON_INSTANCES);
    if (savedInstances) {
      _addonInstances = JSON.parse(savedInstances);
    }
    
    // Validate active addons against registry
    _activeAddons = _activeAddons.filter(addonId => {
      const baseAddonId = addonId.split('-instance-')[0];
      return _addonRegistry.some(addon => addon.id === baseAddonId);
    });
    
    // Save validated active addons back to localStorage
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ADDONS, JSON.stringify(_activeAddons));
  } catch (error) {
    console.error('Error loading addons from localStorage:', error);
    // Reset to prevent further issues
    _activeAddons = [];
    _addonInstances = {};
  }
}

/**
 * Get all available addons
 * @returns {Array} Available addons
 */
export function getAvailableAddons() {
  return _addonRegistry;
}

/**
 * Get addon by ID
 * @param {String} addonId - Addon ID to find
 * @returns {Object|null} Addon object or null if not found
 */
export function getAddonById(addonId) {
  if (!addonId) return null;
  
  try {
    // For instance IDs, extract the base addon ID
    const baseAddonId = addonId.split('-instance-')[0];
    return _addonRegistry.find(addon => addon.id === baseAddonId) || null;
  } catch (error) {
    console.error(`Error getting addon by ID "${addonId}":`, error);
    return null;
  }
}

/**
 * Get active addon instances
 * @returns {Array} Array of active addon instance IDs
 */
export function getActiveAddons() {
  return _activeAddons;
}

/**
 * Get addon instance data
 * @param {String} instanceId - Instance ID
 * @returns {Object|null} Instance data or null if not found
 */
export function getAddonInstanceData(instanceId) {
  if (!instanceId || !_addonInstances[instanceId]) return null;
  return _addonInstances[instanceId];
}

/**
 * Get all instances of a specific addon
 * @param {String} addonId - Base addon ID
 * @returns {Array} Array of instance IDs
 */
export function getAddonInstances(addonId) {
  if (!addonId) return [];
  return _activeAddons.filter(id => id.startsWith(`${addonId}-instance-`));
}

/**
 * Add addon to dashboard (creates a new instance)
 * @param {String} addonId - Addon ID to add
 * @returns {String|null} New instance ID or null if failed
 */
export function addAddonToDashboard(addonId) {
  const addon = getAddonById(addonId);
  if (!addon) {
    console.error(`Addon with ID "${addonId}" not found`);
    return null;
  }
  
  try {
    // Create a unique instance ID
    const instanceCount = getAddonInstances(addonId).length;
    const instanceId = `${addonId}-instance-${Date.now()}-${instanceCount}`;
    
    // Store instance-specific data
    _addonInstances[instanceId] = {
      baseAddonId: addonId,
      title: addon.name, // Can be customized later
      created: new Date().toISOString(),
      settings: {} // For addon-specific settings
    };
    
    // Add to active addons
    _activeAddons.push(instanceId);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ADDONS, JSON.stringify(_activeAddons));
    localStorage.setItem(STORAGE_KEYS.ADDON_INSTANCES, JSON.stringify(_addonInstances));
    
    return instanceId;
  } catch (error) {
    console.error('Error adding addon to dashboard:', error);
    return null;
  }
}

/**
 * Remove addon from dashboard and its associated layout
 * @param {String} instanceId - Instance ID to remove
 * @param {Object} layouts - Current layouts object to update
 * @returns {Object} Updated layouts with addon removed
 */
export function removeAddonFromDashboard(instanceId, layouts = null) {
  if (!instanceId) return layouts;
  
  try {
    const index = _activeAddons.indexOf(instanceId);
    if (index === -1) return layouts;
    
    // Remove from active addons
    _activeAddons.splice(index, 1);
    
    // Remove instance data
    if (_addonInstances[instanceId]) {
      delete _addonInstances[instanceId];
    }
    
    // Update layouts if provided
    let updatedLayouts = layouts;
    if (updatedLayouts) {
      // Remove addon from all breakpoints
      Object.keys(updatedLayouts).forEach(breakpoint => {
        updatedLayouts[breakpoint] = updatedLayouts[breakpoint].filter(
          item => item.i !== instanceId
        );
      });
    }
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ADDONS, JSON.stringify(_activeAddons));
    localStorage.setItem(STORAGE_KEYS.ADDON_INSTANCES, JSON.stringify(_addonInstances));
    
    // Save updated layouts if provided
    if (updatedLayouts) {
      localStorage.setItem(STORAGE_KEYS.LAYOUTS, JSON.stringify(updatedLayouts));
    }
    
    return updatedLayouts;
  } catch (error) {
    console.error('Error removing addon from dashboard:', error);
    return layouts;
  }
}

/**
 * Update addon instance data
 * @param {String} instanceId - Instance ID
 * @param {Object} data - New data to merge
 * @returns {Boolean} Success status
 */
export function updateAddonInstance(instanceId, data) {
  if (!instanceId || !_addonInstances[instanceId]) {
    console.error(`Addon instance with ID "${instanceId}" not found`);
    return false;
  }
  
  try {
    // Merge new data
    _addonInstances[instanceId] = {
      ..._addonInstances[instanceId],
      ...data
    };
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.ADDON_INSTANCES, JSON.stringify(_addonInstances));
    
    return true;
  } catch (error) {
    console.error('Error updating addon instance:', error);
    return false;
  }
}

/**
 * Get default layout for a breakpoint
 * @param {String} breakpoint - Layout breakpoint
 * @returns {Array} Default layout for breakpoint
 */
export function getDefaultLayout(breakpoint) {
  try {
    // Import from layout constants
    const { DEFAULT_LAYOUTS } = require('./layout-constants');
    return DEFAULT_LAYOUTS[breakpoint] || [];
  } catch (error) {
    console.error('Error getting default layout:', error);
    return [];
  }
}

/**
 * Safely parse and validate layouts from localStorage
 * @returns {Object|null} Validated layouts or null if invalid
 */
function parseAndValidateLayouts() {
  try {
    const savedLayouts = localStorage.getItem(STORAGE_KEYS.LAYOUTS);
    if (!savedLayouts) return null;
    
    const layouts = JSON.parse(savedLayouts);
    
    // Basic validation - must be an object with at least one breakpoint
    if (!layouts || typeof layouts !== 'object' || Object.keys(layouts).length === 0) {
      console.warn('Invalid layout format detected, resetting layouts');
      return null;
    }
    
    // Validate each layout item has required properties
    let isValid = true;
    Object.keys(layouts).forEach(breakpoint => {
      if (!Array.isArray(layouts[breakpoint])) {
        isValid = false;
        return;
      }
      
      layouts[breakpoint].forEach(item => {
        if (!item.i || typeof item.x !== 'number' || typeof item.y !== 'number' || 
            typeof item.w !== 'number' || typeof item.h !== 'number') {
          isValid = false;
        }
      });
    });
    
    if (!isValid) {
      console.warn('Invalid layout items detected, resetting layouts');
      return null;
    }
    
    // Filter out layouts for addons that no longer exist
    Object.keys(layouts).forEach(breakpoint => {
      layouts[breakpoint] = layouts[breakpoint].filter(
        item => _activeAddons.includes(item.i)
      );
    });
    
    return layouts;
  } catch (error) {
    console.error('Error parsing layouts from localStorage:', error);
    return null;
  }
}

/**
 * Load user layout with validation
 * @returns {Object|null} Saved layouts or null if not found/invalid
 */
export function loadUserLayout() {
  try {
    const layouts = parseAndValidateLayouts();
    
    // If layouts are invalid or not found, return null
    if (!layouts) {
      resetUserLayout(false); // Reset layouts only, not addons
      return null;
    }
    
    return layouts;
  } catch (error) {
    console.error('Error loading layouts:', error);
    return null;
  }
}

/**
 * Save user layout
 * @param {Object} layouts - Layouts object to save
 * @returns {Boolean} Success status
 */
export function saveUserLayout(layouts) {
  if (!layouts) return false;
  
  try {
    // Add minimal validation
    if (typeof layouts !== 'object' || Object.keys(layouts).length === 0) {
      console.error('Invalid layouts object');
      return false;
    }
    
    localStorage.setItem(STORAGE_KEYS.LAYOUTS, JSON.stringify(layouts));
    return true;
  } catch (error) {
    console.error('Error saving layouts:', error);
    return false;
  }
}

/**
 * Reset user layout to default
 * @param {Boolean} resetAddons - Whether to reset active addons as well
 * @returns {Boolean} Success status
 */
export function resetUserLayout(resetAddons = true) {
  try {
    // Always remove layouts
    localStorage.removeItem(STORAGE_KEYS.LAYOUTS);
    
    // Optionally reset addons and instances
    if (resetAddons) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ADDONS);
      localStorage.removeItem(STORAGE_KEYS.ADDON_INSTANCES);
      _activeAddons = [];
      _addonInstances = {};
    }
    
    return true;
  } catch (error) {
    console.error('Error resetting layouts:', error);
    return false;
  }
}