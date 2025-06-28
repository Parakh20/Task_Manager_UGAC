'use client';

import { useEffect } from 'react';
import { X, Paperclip, CheckSquare, MessageCircle } from 'lucide-react';
import { Task } from '@/types/task';
import TaskForm from './TaskForm';

interface TaskModalProps {
  task?: Task;
  onClose: () => void;
  defaultDate?: string | null;
}

export default function TaskModal({ task, onClose, defaultDate }: TaskModalProps) {
  const isEditing = !!task;

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/30 dark:bg-black/50 backdrop-blur-sm transition-all">
      {/* Backdrop (click to close) */}
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className="
          relative max-w-2xl w-full mx-4
          rounded-2xl
          bg-white dark:bg-gray-950
          border border-gray-200 dark:border-gray-800
          shadow-neumorph
          animate-[fadeIn_0.25s_ease]
          transition-all
          scale-100
          max-h-[90vh]
          overflow-y-auto
        "
        style={{ animation: 'fadeIn 0.25s cubic-bezier(.4,0,.2,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Existing details (optional, for editing) */}
        {isEditing && task && (
          <div className="px-6 pt-4 pb-2 space-y-2 border-b border-gray-100 dark:border-gray-800">
            {/* Subtasks Summary */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <CheckSquare className="h-4 w-4" />
                {task.subtasks.filter(st => st.completed).length} / {task.subtasks.length} subtasks completed
              </div>
            )}

            {/* Attachments Summary */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Paperclip className="h-4 w-4" />
                {task.attachments.length} attachment{task.attachments.length > 1 ? 's' : ''}
              </div>
            )}

            {/* Comments Summary */}
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <MessageCircle className="h-4 w-4" />
                {task.comments.length} comment{task.comments.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <TaskForm
            task={task}
            onSuccess={onClose}
            onCancel={onClose}
            defaultDate={defaultDate}
          />
        </div>
      </div>
      {/* Custom fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.95);}
          100% { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
}
