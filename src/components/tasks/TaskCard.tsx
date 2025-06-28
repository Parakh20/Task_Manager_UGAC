'use client';

import { format } from 'date-fns';
import { Edit2, Trash2, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Task } from '@/types/task';
import { useTask } from '@/context/TaskContext';
import { getPriorityColor, getStatusColor } from '@/utils/taskUtils';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  isDragging?: boolean;
}

export default function TaskCard({ task, onEdit, isDragging = false }: TaskCardProps) {
  const { deleteTask } = useTask();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(task);
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';

  return (
    <div
      className={`task-card ${isDragging ? 'shadow-lg' : ''} ${
        isOverdue ? 'border-l-4 border-l-red-500' : ''
      } cursor-pointer group`}
      onClick={() => onEdit?.(task)}
    >
      {/* Header */}
      <div className="flex items-stretch justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        
        <div className="flex items-start gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-1 text-gray-400 hover:text-blue-600 rounded"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-600 rounded"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex items-center gap-1 mb-3 flex-wrap">
          <Tag className="h-3 w-3 text-gray-400" />
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Due Date */}
      <div className={`flex items-center gap-1 text-sm mb-3 ${
        isOverdue ? 'text-red-600' : 'text-gray-600'
      }`}>
        <Calendar className="h-4 w-4" />
        <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
        {isOverdue && <AlertCircle className="h-4 w-4 ml-1" />}
      </div>

      {/* Priority and Status */}
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}
        >
          {task.priority}
        </span>
        
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}
        >
          {task.status}
        </span>
      </div>
    </div>
  );
}
