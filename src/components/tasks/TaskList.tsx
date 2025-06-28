'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Edit2,
  Trash2,
  Calendar,
  Tag,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Paperclip,
  MessageCircle,
} from 'lucide-react';
import { Task } from '@/types/task';
import { useTask } from '@/context/TaskContext';
import { getPriorityColor, getStatusColor } from '@/utils/taskUtils';

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

export default function TaskList({ onEditTask }: TaskListProps) {
  const { filteredTasks, deleteTask } = useTask();
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const toggleExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (expandedTasks.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const handleDelete = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const handleEdit = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    onEditTask(task);
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">No tasks found</div>
        <div className="text-gray-500 dark:text-gray-400">Create your first task to get started!</div>
      </div>
    );
  }

  return (
    <div className="bg-transparent dark:bg-transparent rounded-xl overflow-hidden">
      <div className="flex flex-col gap-6">
        {filteredTasks.map(task => {
          const isExpanded = expandedTasks.has(task.id);
          const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';

          return (
            <div
              key={task.id}
              className={`
                relative bg-white dark:bg-gray-950 rounded-2xl px-6 py-5 mb-2
                border border-gray-200 dark:border-gray-800
                shadow-[0_4px_24px_0_rgba(0,0,0,0.10),0_1.5px_6px_0_rgba(0,0,0,0.06)]
                hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.14),0_2px_8px_0_rgba(0,0,0,0.10)]
                hover:scale-[1.015]
                active:scale-95
                transition-all duration-200 group
                ${isOverdue ? 'border-l-4 border-l-red-500' : ''}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {task.description && (
                      <button
                        onClick={() => toggleExpanded(task.id)}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    )}
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-lg">{task.title}</h3>
                  </div>

                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      <Tag className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Subtasks / Checklist summary */}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <CheckSquare className="h-4 w-4" />
                      {task.subtasks.filter(st => st.completed).length} / {task.subtasks.length} subtasks completed
                    </div>
                  )}

                  {/* Attachments summary */}
                  {task.attachments && task.attachments.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <Paperclip className="h-4 w-4" />
                      {task.attachments.length} attachment{task.attachments.length > 1 ? 's' : ''}
                    </div>
                  )}

                  {/* Comments summary */}
                  {task.comments && task.comments.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <MessageCircle className="h-4 w-4" />
                      {task.comments.length} comment{task.comments.length > 1 ? 's' : ''}
                    </div>
                  )}

                  {/* Expanded Description */}
                  {isExpanded && task.description && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <p className="text-sm text-gray-700 dark:text-gray-200">{task.description}</p>
                    </div>
                  )}

                  {/* Due Date */}
                  <div className={`flex items-center gap-1 text-sm mt-2 ${
                    isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                    {isOverdue && <AlertCircle className="h-4 w-4 ml-1" />}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  {/* Priority */}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-sm
                      ${getPriorityColor(task.priority)}
                    `}
                  >
                    {task.priority}
                  </span>

                  {/* Status */}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-sm ${getStatusColor(task.status)}`}
                  >
                    {task.status}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 mt-2">
                    <button
                      onClick={(e) => handleEdit(task, e)}
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded transition"
                      aria-label="Edit task"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(task.id, e)}
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded transition"
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
