'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Task, TaskFormData, Subtask, TaskAttachment } from '@/types/task';
import { useTask } from '@/context/TaskContext';
import { format } from 'date-fns';
import { Plus, X, Paperclip, Trash2 } from 'lucide-react';

// Fixed schema
const taskSchema = yup.object({
  title: yup.string().required('Title is required').min(1, 'Title cannot be empty'),
  description: yup.string().optional(),
  dueDate: yup.string().required('Due date is required'),
  priority: yup.mixed<'Low' | 'Medium' | 'High'>().oneOf(['Low', 'Medium', 'High']).required('Priority is required'),
  tags: yup.string().optional(),
  status: yup.mixed<'Todo' | 'In Progress' | 'Done'>().oneOf(['Todo', 'In Progress', 'Done']).required('Status is required'),
  subtasks: yup.array().of(
    yup.object().shape({
      id: yup.string().optional(),
      title: yup.string().required('Subtask title is required'),
      completed: yup.boolean().optional()
    })
  ).optional()
});

interface TaskFormProps {
  task?: Task;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultDate?: string | null;
}

export default function TaskForm({ task, onSuccess, onCancel, defaultDate }: TaskFormProps) {
  const { addTask, updateTask } = useTask();
  const isEditing = !!task;

  const [attachments, setAttachments] = useState<TaskAttachment[]>(task?.attachments || []);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [comment, setComment] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      dueDate: task?.dueDate 
        ? format(new Date(task.dueDate), 'yyyy-MM-dd') 
        : defaultDate || '',
      priority: task?.priority || 'Medium',
      tags: task?.tags?.join(', ') || '',
      status: task?.status || 'Todo',
      subtasks: task?.subtasks?.map(s => ({ 
        id: s.id, 
        title: s.title, 
        completed: s.completed 
      })) || [],
    },
  });

  // Subtasks field array
  const { fields: subtaskFields, append, remove, update } = useFieldArray({
    control,
    name: 'subtasks',
  });

  // Handle file attachments
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setAttachmentFiles(prev => [...prev, ...files]);
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (formData: TaskFormData) => {
    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || '',
        dueDate: formData.dueDate,
        priority: formData.priority,
        tags: formData.tags,
        status: formData.status,
        subtasks: formData.subtasks?.map(s => ({
          id: s.id || Math.random().toString(36).slice(2),
          title: s.title,
          completed: s.completed || false,
        })) || [],
        attachments: [
          ...attachments,
          ...attachmentFiles.map(f => ({
            id: Math.random().toString(36).slice(2),
            name: f.name,
            url: URL.createObjectURL(f),
          })),
        ],
        comments: task?.comments || [],
      };

      if (comment.trim()) {
        taskData.comments = [
          ...(taskData.comments || []),
          {
            id: Math.random().toString(36).slice(2),
            text: comment.trim(),
            createdAt: new Date().toISOString(),
          },
        ];
      }

      if (isEditing && task) {
        updateTask(task.id, taskData);
      } else {
        addTask(taskData);
      }

      reset();
      setAttachmentFiles([]);
      setComment('');
      onSuccess?.();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Title *
        </label>
        <input
          {...register('title')}
          type="text"
          id="title"
          className="w-full px-3 py-2 bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-primary-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition"
          placeholder="Enter task title..."
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={3}
          className="w-full px-3 py-2 bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-primary-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition resize-none"
          placeholder="Enter task description..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Due Date *
        </label>
        <input
          {...register('dueDate')}
          type="date"
          id="dueDate"
          className="w-full px-3 py-2 bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-primary-500 text-gray-900 dark:text-gray-100 transition"
        />
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
        )}
      </div>

      {/* Priority and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Priority *
          </label>
          <select
            {...register('priority')}
            id="priority"
            className="w-full px-3 py-2 bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-primary-500 text-gray-900 dark:text-gray-100 transition"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Status *
          </label>
          <select
            {...register('status')}
            id="status"
            className="w-full px-3 py-2 bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-primary-500 text-gray-900 dark:text-gray-100 transition"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Tags
        </label>
        <input
          {...register('tags')}
          type="text"
          id="tags"
          className="w-full px-3 py-2 bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-primary-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition"
          placeholder="Enter tags separated by commas..."
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Separate multiple tags with commas (e.g., work, urgent, meeting)
        </p>
        {errors.tags && (
          <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
        )}
      </div>

      {/* Subtasks / Checklist */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Subtasks / Checklist
        </label>
        <div className="space-y-2">
          {subtaskFields.map((subtask, idx) => (
            <div key={subtask.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!subtask.completed}
                onChange={e => update(idx, { ...subtask, completed: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <input
                {...register(`subtasks.${idx}.title` as const)}
                defaultValue={subtask.title}
                className="flex-1 px-2 py-1 border-b border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:border-primary-500"
                placeholder="Subtask title"
              />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                aria-label="Remove subtask"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ 
              title: '', 
              completed: false, 
              id: Math.random().toString(36).slice(2) 
            })}
            className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            <Plus className="h-4 w-4" /> Add Subtask
          </button>
        </div>
      </div>

      {/* Attachments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Attachments
        </label>
        <div className="space-y-2">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 dark:file:bg-gray-700 file:text-primary-700 dark:file:text-primary-300 hover:file:bg-gray-200 dark:hover:file:bg-gray-600"
          />
          
          {/* Existing Attachments */}
          {attachments.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Existing attachments:</p>
              <ul className="space-y-1">
                {attachments.map((attachment, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Paperclip className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{attachment.name}</span>
                    <button
                      type="button"
                      onClick={() => removeExistingAttachment(idx)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Remove attachment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* New Attachments */}
          {attachmentFiles.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">New attachments:</p>
              <ul className="space-y-1">
                {attachmentFiles.map((file, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Paperclip className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Remove attachment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Comments / Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Notes / Comments
        </label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 bg-transparent border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-primary-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition resize-none"
          placeholder="Add a note or comment (optional)..."
        />
        {/* Existing Comments Display */}
        {task?.comments && task.comments.length > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Previous comments:</p>
            {task.comments.map((comment, idx) => (
              <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                {comment.text}
                <span className="text-gray-400 dark:text-gray-500 ml-2">
                  ({new Date(comment.createdAt).toLocaleDateString()})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-black dark:text-white font-medium transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}