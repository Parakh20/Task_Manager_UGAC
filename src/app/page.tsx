'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskList from '@/components/tasks/TaskList';
import TaskBoard from '@/components/tasks/TaskBoard';
import TaskModal from '@/components/tasks/TaskModal';
import { useTask } from '@/context/TaskContext';
import { Task } from '@/types/task';
import { LayoutGrid, List, Plus } from 'lucide-react';

export default function Home() {
  const { isLoading, error } = useTask();
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-600 text-lg font-medium mb-2">Error</div>
            <div className="text-gray-500 dark:text-gray-400">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-10 py-12">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-1">Task Manager</h1>
              <p className="text-gray-400 dark:text-gray-500 text-lg">Minimal, modern, and efficient task tracking</p>
            </div>
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center bg-transparent rounded-full shadow-none border-none">
                <button
                  onClick={() => setViewMode('board')}
                  className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500
                    ${viewMode === 'board'
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  aria-label="Board View"
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500
                    ${viewMode === 'list'
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  aria-label="List View"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              {/* Create Task Button */}
              <button
                onClick={handleCreateTask}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg transition focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <Plus className="h-5 w-5" />
                New Task
              </button>
            </div>
          </div>
        </div>
        {/* Filters Section */}
        <div className="mb-8">
          <TaskFilters />
        </div>
        {/* Tasks Section */}
        <div className="mt-2">
          {viewMode === 'board' ? (
            <TaskBoard onEditTask={handleEditTask} />
          ) : (
            <TaskList onEditTask={handleEditTask} />
          )}
        </div>
      </main>
      {/* Task Modal */}
      {isModalOpen && (
  <TaskModal
    task={editingTask ?? undefined}
    onClose={handleCloseModal}
  />
)}
    </div>
  );
}
