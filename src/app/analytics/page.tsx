'use client';

import Navbar from '@/components/layout/Navbar';
import { useTask } from '@/context/TaskContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function AnalyticsPage() {
  const { getTaskStats } = useTask();
  const stats = getTaskStats();

  const statusData = [
    { name: 'To Do', value: stats.todo, color: '#64748b' },
    { name: 'In Progress', value: stats.inProgress, color: '#fb923c' },
    { name: 'Completed', value: stats.done, color: '#22c55e' },
    { name: 'Overdue', value: stats.overdue, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Analytics</h1>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Tasks by Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#888" className="text-xs" />
              <YAxis allowDecimals={false} stroke="#888" className="text-xs" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(30,41,59,0.95)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                }}
                labelStyle={{ color: '#fff' }}
                cursor={{ fill: '#e5e7eb', opacity: 0.1 }}
              />
              <Bar dataKey="value">
                {statusData.map((entry, idx) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
