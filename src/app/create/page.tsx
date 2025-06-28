'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import TaskForm from '@/components/tasks/TaskForm';
import { ArrowLeft } from 'lucide-react';

export default function CreateTaskPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create New Task</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Add a new task to your list</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <TaskForm
            onSuccess={() => router.push('/')}
            onCancel={() => router.back()}
          />
        </div>
      </main>
    </div>
  );
}
