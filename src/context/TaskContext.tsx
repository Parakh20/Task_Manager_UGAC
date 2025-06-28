'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Task, TaskFilters, TaskSortBy, SortOrder } from '@/types/task';
import { storage } from '@/utils/localStorage';
import { filterTasks, sortTasks, generateId } from '@/utils/taskUtils';

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  filters: TaskFilters;
  sortBy: TaskSortBy;
  sortOrder: SortOrder;
  isLoading: boolean;
  error: string | null;
}

type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FILTERS'; payload: TaskFilters }
  | { type: 'SET_SORT'; payload: { sortBy: TaskSortBy; sortOrder: SortOrder } }
  | { type: 'CLEAR_ALL_TASKS' }
  | { type: 'IMPORT_TASKS'; payload: Task[] }
  | { type: 'REORDER_TASKS'; payload: { status: string; sourceIdx: number; destIdx: number } }; // <-- Added

interface TaskContextType extends TaskState {
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setFilters: (filters: TaskFilters) => void;
  setSorting: (sortBy: TaskSortBy, sortOrder: SortOrder) => void;
  clearAllTasks: () => void;
  exportTasks: () => void;
  importTasks: (file: File) => Promise<void>;
  getTaskStats: () => {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
    overdue: number;
  };
  reorderTasks: (status: string, sourceIdx: number, destIdx: number) => void; // <-- Added
}

const initialState: TaskState = {
  tasks: [],
  filteredTasks: [],
  filters: {
    status: 'All',
    priority: 'All',
    dueDateFilter: 'All',
    searchQuery: '',
  },
  sortBy: 'dueDate',
  sortOrder: 'asc',
  isLoading: false,
  error: null,
};

// Helper for reordering within a column
function reorder(list: Task[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    // ... all your other cases

    case 'REORDER_TASKS': {
      const { status, sourceIdx, destIdx } = action.payload;
      // Only reorder within the same status column
      const tasksOfStatus = state.tasks.filter(task => task.status === status);
      const otherTasks = state.tasks.filter(task => task.status !== status);

      const reordered = reorder(tasksOfStatus, sourceIdx, destIdx);

      // Merge back, keeping order only within the column
      const updatedTasks = [
        ...otherTasks,
        ...reordered
      ];

      storage.saveTasks(updatedTasks);

      const filtered = filterTasks(updatedTasks, state.filters);
      const sorted = sortTasks(filtered, state.sortBy, state.sortOrder);

      return {
        ...state,
        tasks: updatedTasks,
        filteredTasks: sorted,
      };
    }

    // ... rest of your reducer
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'LOAD_TASKS': {
      const tasks = action.payload;
      const filtered = filterTasks(tasks, state.filters);
      const sorted = sortTasks(filtered, state.sortBy, state.sortOrder);
      return {
        ...state,
        tasks,
        filteredTasks: sorted,
        isLoading: false,
      };
    }

    case 'ADD_TASK': {
      const taskData = action.payload;
      const newTask: Task = {
          ...action.payload,
  priority: action.payload.priority as 'Low' | 'Medium' | 'High',
        ...taskData,
        id: generateId(),
        tags: taskData.tags
          ? taskData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
          : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subtasks: taskData.subtasks?.map(s => ({
          id: s.id || generateId(),
          title: s.title,
          completed: s.completed || false
        })) || [],
      };
      const updatedTasks = [...state.tasks, newTask];
      const filtered = filterTasks(updatedTasks, state.filters);
      const sorted = sortTasks(filtered, state.sortBy, state.sortOrder);

      storage.saveTasks(updatedTasks);

      return {
        ...state,
        tasks: updatedTasks,
        filteredTasks: sorted,
      };
    }

    case 'UPDATE_TASK': {
      const { id, updates } = action.payload;
      const updatedTasks = state.tasks.map(task => {
        if (task.id === id) {
          const newTags = updates.tags && typeof updates.tags === 'string'
            ? updates.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
            : updates.tags;
            
          const newSubtasks = updates.subtasks?.map(s => ({
            id: s.id || generateId(),
            title: s.title,
            completed: s.completed || false
          })) || task.subtasks;
          
          return {
            ...task,
            priority: updates.priority as 'Low' | 'Medium' | 'High' || task.priority,
            ...updates,
            tags: newTags || task.tags,
            subtasks: newSubtasks,
            updatedAt: new Date().toISOString()
          };
        }
        return task;
      });
      
      const filtered = filterTasks(updatedTasks, state.filters);
      const sorted = sortTasks(filtered, state.sortBy, state.sortOrder);

      storage.saveTasks(updatedTasks);

      return {
        ...state,
        tasks: updatedTasks,
        filteredTasks: sorted,
      };
    }

    case 'DELETE_TASK': {
      const updatedTasks = state.tasks.filter(task => task.id !== action.payload);
      const filtered = filterTasks(updatedTasks, state.filters);
      const sorted = sortTasks(filtered, state.sortBy, state.sortOrder);

      storage.saveTasks(updatedTasks);

      return {
        ...state,
        tasks: updatedTasks,
        filteredTasks: sorted,
      };
    }

    case 'SET_FILTERS': {
      const filtered = filterTasks(state.tasks, action.payload);
      const sorted = sortTasks(filtered, state.sortBy, state.sortOrder);

      return {
        ...state,
        filters: action.payload,
        filteredTasks: sorted,
      };
    }

    case 'SET_SORT': {
      const sorted = sortTasks(state.filteredTasks, action.payload.sortBy, action.payload.sortOrder);

      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
        filteredTasks: sorted,
      };
    }

    case 'CLEAR_ALL_TASKS':
      storage.clearTasks();
      return {
        ...state,
        tasks: [],
        filteredTasks: [],
      };

    case 'IMPORT_TASKS': {
      const filtered = filterTasks(action.payload, state.filters);
      const sorted = sortTasks(filtered, state.sortBy, state.sortOrder);

      storage.saveTasks(action.payload);

      return {
        ...state,
        tasks: action.payload,
        filteredTasks: sorted,
      };
    }

    default:
      return state;
  }
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks from localStorage on mount
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const savedTasks = storage.getTasks();
      dispatch({ type: 'LOAD_TASKS', payload: savedTasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load tasks' });
    }
  }, []);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const setFilters = (filters: TaskFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setSorting = (sortBy: TaskSortBy, sortOrder: SortOrder) => {
    dispatch({ type: 'SET_SORT', payload: { sortBy, sortOrder } });
  };

  const clearAllTasks = () => {
    dispatch({ type: 'CLEAR_ALL_TASKS' });
  };

  const exportTasks = () => {
    storage.exportTasks();
  };

  const importTasks = async (file: File) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const tasks = await storage.importTasks(file);
      dispatch({ type: 'IMPORT_TASKS', payload: tasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to import tasks' });
    }
  };

  const getTaskStats = () => {
    const total = state.tasks.length;
    const todo = state.tasks.filter(task => task.status === 'Todo').length;
    const inProgress = state.tasks.filter(task => task.status === 'In Progress').length;
    const done = state.tasks.filter(task => task.status === 'Done').length;
    const overdue = state.tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      return dueDate < now && task.status !== 'Done';
    }).length;

    return { total, todo, inProgress, done, overdue };
  };

  // Drag-and-drop reorder within a column
  const reorderTasks = (status: string, sourceIdx: number, destIdx: number) => {
    dispatch({ type: 'REORDER_TASKS', payload: { status, sourceIdx, destIdx } });
  };

  const value: TaskContextType = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    setFilters,
    setSorting,
    clearAllTasks,
    exportTasks,
    importTasks,
    getTaskStats,
    reorderTasks, // <-- Added
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
