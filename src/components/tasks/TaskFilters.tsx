'use client';

import { useState } from 'react';
import { useTask } from '@/context/TaskContext';
import { TaskFilters as ITaskFilters, TaskSortBy, SortOrder } from '@/types/task';
import { Search, Filter, X, ArrowUpDown, Tag } from 'lucide-react';

export default function TaskFilters() {
  const { filters, setFilters, setSorting, sortBy, sortOrder, tasks } = useTask();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');

  // Collect all unique tags from all tasks for the tag filter dropdown
  const allTags = Array.from(
    new Set(tasks.flatMap((task) => task.tags).filter(Boolean))
  );

  const handleFilterChange = (newFilters: Partial<ITaskFilters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    handleFilterChange({ searchQuery: query });
  };

  const handleSortChange = (newSortBy: TaskSortBy) => {
    const newOrder: SortOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    setSorting(newSortBy, newOrder);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilters({
      status: 'All',
      priority: 'All',
      dueDateFilter: 'All',
      searchQuery: '',
      tags: [],
    });
  };

  const hasActiveFilters =
    filters.status !== 'All' ||
    filters.priority !== 'All' ||
    filters.dueDateFilter !== 'All' ||
    (filters.searchQuery && filters.searchQuery.length > 0) ||
    (filters.tags && filters.tags.length > 0);

  // Handle tag filter changes (multi-select)
  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    if (currentTags.includes(tag)) {
      handleFilterChange({ tags: currentTags.filter((t) => t !== tag) });
    } else {
      handleFilterChange({ tags: [...currentTags, tag] });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filters.status || 'All'}
            onChange={(e) => handleFilterChange({ status: e.target.value as any })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="All">All Status</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={filters.priority || 'All'}
            onChange={(e) => handleFilterChange({ priority: e.target.value as any })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={filters.dueDateFilter || 'All'}
            onChange={(e) => handleFilterChange({ dueDateFilter: e.target.value as any })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="All">All Dates</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="Overdue">Overdue</option>
          </select>

          {/* Tag Filter (multi-select chips) */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-2 py-1 rounded-full text-xs font-medium border transition
                    ${filters.tags?.includes(tag)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Sort */}
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as TaskSortBy)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="createdAt">Created</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={() => setSorting(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-300">Active filters:</span>
            
            {filters.status !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                Status: {filters.status}
                <button onClick={() => handleFilterChange({ status: 'All' })}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.priority !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded">
                Priority: {filters.priority}
                <button onClick={() => handleFilterChange({ priority: 'All' })}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.dueDateFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                Due: {filters.dueDateFilter}
                <button onClick={() => handleFilterChange({ dueDateFilter: 'All' })}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {/* Active Tag Filters */}
            {filters.tags && filters.tags.length > 0 && filters.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                Tag: {tag}
                <button onClick={() => handleTagToggle(tag)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            
            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded">
                Search: "{filters.searchQuery}"
                <button onClick={() => handleSearchChange('')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
