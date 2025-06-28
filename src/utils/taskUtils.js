// src/utils/taskUtils.ts

import { Task, TaskFilters, TaskSortBy, SortOrder } from '@/types/task';
import { isToday, isThisWeek, isPast } from 'date-fns';

// Generate a unique ID for each task
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};


// Filter tasks based on filters object
export const filterTasks = (tasks, filters) => {
  return tasks.filter(task => {
    // Status filter
    if (filters.status && filters.status !== 'All' && task.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority && filters.priority !== 'All' && task.priority !== filters.priority) {
      return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag =>
        task.tags.some(taskTag =>
          taskTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasMatchingTag) return false;
    }

    // Due date filter
    if (filters.dueDateFilter && filters.dueDateFilter !== 'All') {
      const taskDate = new Date(task.dueDate);
      switch (filters.dueDateFilter) {
        case 'Today':
          if (!isToday(taskDate)) return false;
          break;
        case 'This Week':
          if (!isThisWeek(taskDate)) return false;
          break;
        case 'Overdue':
          if (!isPast(taskDate) || task.status === 'Done') return false;
          break;
      }
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(query);
      const matchesDescription = task.description?.toLowerCase().includes(query);
      const matchesTags = task.tags.some(tag => tag.toLowerCase().includes(query));

      if (!matchesTitle && !matchesDescription && !matchesTags) {
        return false;
      }
    }

    return true;
  });
};

// Sort tasks by a given field and order
export const sortTasks = (tasks, sortBy, order = 'asc') => {
  return [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'dueDate':
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      default:
        return 0;
    }

    return order === 'desc' ? -comparison : comparison;
  });
};


// Get color classes for priority
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Low':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};


// Get color classes for status
export const getStatusColor = (status) => {
  switch (status) {
    case 'Todo':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'In Progress':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'Done':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};