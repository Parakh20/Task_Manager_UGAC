'use client';
import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { useParams, useRouter } from 'next/navigation';
import { useTask } from '@/context/TaskContext';
import { format } from 'date-fns';
import { ArrowLeft, Edit2, Trash2, Calendar, Tag, Clock, AlertCircle, CheckSquare, Paperclip, MessageCircle } from 'lucide-react';
import { getPriorityColor, getStatusColor } from '@/utils/taskUtils';
import TaskModal from '@/components/tasks/TaskModal';
import Navbar from '@/components/layout/Navbar';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { tasks, deleteTask } = useTask();
  const [task, setTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const taskId = params.id as string;
    const foundTask = tasks.find(t => t.id === taskId);
    setTask(foundTask || null);
  }, [params.id, tasks]);

  const handleDelete = () => {
    if (task && confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      router.push('/');
    }
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-gray-500 text-lg mb-2">Task not found</div>
            <button
              onClick={() => router.push('/')}
              className="text-primary-600 hover:text-primary-700"
            >
              Go back to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';

  // Defensive: Always use tagsArray as string[]
  const tagsArray: string[] =
    Array.isArray(task.tags)
      ? task.tags
      : typeof task.tags === 'string'
        ? task.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Header */}
          <div className={`p-6 border-b border-gray-200 dark:border-gray-800 ${isOverdue ? 'border-l-4 border-l-red-500' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{task.title}</h1>
                {/* Status and Priority */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority} Priority
                  </span>
                </div>
                {/* Due Date */}
                <div className={`flex items-center gap-2 text-sm ${
                  isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  <Calendar className="h-4 w-4" />
                  <span>Due: {format(new Date(task.dueDate), 'EEEE, MMMM dd, yyyy')}</span>
                  {isOverdue && (
                    <>
                      <AlertCircle className="h-4 w-4 ml-2" />
                      <span className="font-medium">Overdue</span>
                    </>
                  )}
                </div>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Description */}
            {task.description && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Description</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{task.description}</p>
                </div>
              </div>
            )}

            {/* Tags - Defensive, always an array */}
            {tagsArray.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Tags</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-gray-400" />
                  {tagsArray.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Subtasks summary */}
            {task.subtasks?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Subtasks</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckSquare className="h-4 w-4" />
                  {task.subtasks?.filter(st => st.completed).length} / {task.subtasks?.length} completed
                </div>
              </div>
            )}

            {/* Attachments summary */}
            {task.attachments?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Attachments</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Paperclip className="h-4 w-4" />
                  {task.attachments?.length} attachment{task.attachments!.length > 1 ? 's' : ''}
                </div>
              </div>
            )}

            {/* Comments summary */}
            {task.comments?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Comments</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MessageCircle className="h-4 w-4" />
                  {task.comments?.length} comment{task.comments!.length > 1 ? 's' : ''}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Created</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{format(new Date(task.createdAt), 'MMMM dd, yyyy \'at\' h:mm a')}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Last Updated</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{format(new Date(task.updatedAt), 'MMMM dd, yyyy \'at\' h:mm a')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <TaskModal
          task={task}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}
