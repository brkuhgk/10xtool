/**
 * Layout Constants
 * Configuration for grid layout and default card dimensions
 */

// Grid configuration for responsive layouts
export const GRID_CONFIG = {
  breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  rowHeight: 30,
  margin: [15, 15], // Reduced margins to make layout less spaced out
  containerPadding: [10, 10],
};

// Default dimensions for each addon type
export const DEFAULT_CARD_DIMENSIONS = {
  // Planning
  calendar: { w: 4, h: 7, minW: 3, minH: 5 },
  
  // Productivity
  pomodoroCounter: { w: 3, h: 5, minW: 2, minH: 4 },
  pomodoroActivity: { w: 5, h: 5, minW: 4, minH: 4 },
  workMode: { w: 3, h: 7, minW: 2, minH: 5 },
  focusMusic: { w: 4, h: 8, minW: 3, minH: 6 },
  
  // Tasks
  completedTasks: { w: 4, h: 8, minW: 3, minH: 5 },
  todoTasks: { w: 4, h: 8, minW: 3, minH: 5 },
  overdueTasks: { w: 4, h: 7, minW: 3, minH: 5 },
  
  // Stats
  position: { w: 3, h: 7, minW: 2, minH: 5 },
  
  // Notes
  quickNote: { w: 4, h: 7, minW: 3, minH: 5 },
  
  // Brainstorming
  mindMap: { w: 6, h: 8, minW: 4, minH: 6 },
  ideaGenerator: { w: 4, h: 7, minW: 3, minH: 5 },
  
  // Default dimensions for any other addon
  default: { w: 4, h: 7, minW: 2, minH: 4 }
};

// Default layouts for new dashboards - improved spacing and organization
export const DEFAULT_LAYOUTS = {
  lg: [
    // Top row
    { i: 'calendar', x: 0, y: 0, w: 4, h: 7 },
    { i: 'pomodoroCounter', x: 4, y: 0, w: 3, h: 5 },
    { i: 'position', x: 7, y: 0, w: 3, h: 7 },
    { i: 'quickNote', x: 10, y: 0, w: 4, h: 7 },
    
    // Middle row
    { i: 'todoTasks', x: 0, y: 7, w: 4, h: 8 },
    { i: 'workMode', x: 4, y: 5, w: 3, h: 6 },
    { i: 'mindMap', x: 7, y: 7, w: 5, h: 8 }
  ],
  md: [
    // Top row
    { i: 'calendar', x: 0, y: 0, w: 5, h: 7 },
    { i: 'pomodoroCounter', x: 5, y: 0, w: 5, h: 5 },
    
    // Second row
    { i: 'todoTasks', x: 0, y: 7, w: 5, h: 8 },
    { i: 'workMode', x: 5, y: 5, w: 5, h: 6 },
    
    // Third row
    { i: 'position', x: 0, y: 15, w: 5, h: 7 },
    { i: 'quickNote', x: 5, y: 11, w: 5, h: 7 }
  ],
  sm: [
    { i: 'calendar', x: 0, y: 0, w: 6, h: 7 },
    { i: 'pomodoroCounter', x: 0, y: 7, w: 6, h: 5 },
    { i: 'todoTasks', x: 0, y: 12, w: 6, h: 8 },
    { i: 'workMode', x: 0, y: 20, w: 6, h: 6 },
    { i: 'position', x: 0, y: 26, w: 6, h: 7 }
  ]
};