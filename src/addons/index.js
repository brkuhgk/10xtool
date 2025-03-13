/**
 * Addon Registry
 * Central registry of all available addons for the dashboard
 */

// Import addon components
import Calendar from './calendar';
import PomodoroActivity from './pomodoro-activity';
import PomodoroCounter from './pomodoro-counter';
import Position from './position';
import WorkMode from './work-mode';
import QuickNote from './quick-note';
import CompletedTasks from './completed-tasks';
import TodoTasks from './todo-tasks';
import OverdueTasks from './overdue-tasks';
import MindMap from './mind-map';
import IdeaGenerator from './idea-generator';
import FocusMusic from './focus-music';

// Import Lucide icons
import { 
  Calendar as CalendarIcon, 
  Clock, 
  BarChart2, 
  Briefcase, 
  StickyNote, 
  CheckCircle, 
  Circle, 
  AlertTriangle,
  Activity,
  Network,
  Lightbulb,
  Music
} from 'lucide-react';

// Import default dimensions
import { DEFAULT_CARD_DIMENSIONS } from '../services/layout-constants';

/**
 * Registry of all available addons
 */
export const ADDONS = [
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Monthly calendar view with date selection',
    component: Calendar,
    defaultSize: DEFAULT_CARD_DIMENSIONS.calendar,
    icon: CalendarIcon,
    category: 'planning'
  },
  {
    id: 'pomodoroActivity',
    name: 'Pomodoro Activity',
    description: 'Track your daily and weekly pomodoro sessions',
    component: PomodoroActivity,
    defaultSize: DEFAULT_CARD_DIMENSIONS.pomodoroActivity,
    icon: Activity,
    category: 'productivity'
  },
  {
    id: 'pomodoroCounter',
    name: 'Pomodoro Timer',
    description: 'Track time with the Pomodoro technique',
    component: PomodoroCounter,
    defaultSize: DEFAULT_CARD_DIMENSIONS.pomodoroCounter,
    icon: Clock,
    category: 'productivity'
  },
  {
    id: 'position',
    name: 'Position',
    description: 'Your current productivity ranking',
    component: Position,
    defaultSize: DEFAULT_CARD_DIMENSIONS.position,
    icon: BarChart2,
    category: 'stats'
  },
  {
    id: 'workMode',
    name: 'Work Mode',
    description: 'Toggle focused work mode',
    component: WorkMode,
    defaultSize: DEFAULT_CARD_DIMENSIONS.workMode,
    icon: Briefcase,
    category: 'productivity'
  },
  {
    id: 'quickNote',
    name: 'Quick Note',
    description: 'Jot down quick thoughts',
    component: QuickNote,
    defaultSize: DEFAULT_CARD_DIMENSIONS.quickNote,
    icon: StickyNote,
    category: 'notes'
  },
  {
    id: 'completedTasks',
    name: 'Completed Tasks',
    description: 'View tasks you\'ve completed today',
    component: CompletedTasks,
    defaultSize: DEFAULT_CARD_DIMENSIONS.completedTasks,
    icon: CheckCircle,
    category: 'tasks'
  },
  {
    id: 'todoTasks',
    name: 'Todo Tasks',
    description: 'Manage tasks you need to complete',
    component: TodoTasks,
    defaultSize: DEFAULT_CARD_DIMENSIONS.todoTasks,
    icon: Circle,
    category: 'tasks'
  },
  {
    id: 'overdueTasks',
    name: 'Overdue Tasks',
    description: 'Track tasks that need urgent attention',
    component: OverdueTasks,
    defaultSize: DEFAULT_CARD_DIMENSIONS.overdueTasks,
    icon: AlertTriangle,
    category: 'tasks'
  },
  {
    id: 'mindMap',
    name: 'Mind Map',
    description: 'Simple visual brainstorming tool',
    component: MindMap,
    defaultSize: DEFAULT_CARD_DIMENSIONS.mindMap,
    icon: Network,
    category: 'brainstorming'
  },
  {
    id: 'ideaGenerator',
    name: 'Idea Generator',
    description: 'Get creative prompts and inspiration',
    component: IdeaGenerator,
    defaultSize: DEFAULT_CARD_DIMENSIONS.ideaGenerator,
    icon: Lightbulb,
    category: 'brainstorming'
  },
  {
    id: 'focusMusic',
    name: 'Focus Music',
    description: 'Play ambient sounds to boost focus',
    component: FocusMusic,
    defaultSize: DEFAULT_CARD_DIMENSIONS.focusMusic,
    icon: Music,
    category: 'productivity'
  }
];

/**
 * Get addons by category
 * @param {String} category - Category to filter by
 * @returns {Array} Filtered addons
 */
export function getAddonsByCategory(category) {
  if (!category) return ADDONS;
  return ADDONS.filter(addon => addon.category === category);
}

/**
 * Get available categories
 * @returns {Array} Unique categories
 */
export function getAddonCategories() {
  const categories = ADDONS.map(addon => addon.category);
  return [...new Set(categories)];
}

export default ADDONS;