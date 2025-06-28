'use client';

import { useTask } from '@/context/TaskContext';
import { CheckCircle, Clock, AlertTriangle, ListTodo } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function TaskStats() {
  const { getTaskStats } = useTask();
  const stats = getTaskStats();

  const statItems = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900',
      borderColor: 'border-blue-200 dark:border-blue-700',
    },
    {
      title: 'To Do',
      value: stats.todo,
      icon: Clock,
      color: 'text-gray-600 dark:text-gray-300',
      bgColor: 'bg-gray-50 dark:bg-gray-900',
      borderColor: 'border-gray-200 dark:border-gray-700',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: AlertTriangle,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900',
      borderColor: 'border-orange-200 dark:border-orange-700',
    },
    {
      title: 'Completed',
      value: stats.done,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900',
      borderColor: 'border-green-200 dark:border-green-700',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900',
      borderColor: 'border-red-200 dark:border-red-700',
    },
  ];

  // Prepare data for recharts
  const chartData = [
    { name: 'To Do', value: stats.todo, color: '#64748b' },
    { name: 'In Progress', value: stats.inProgress, color: '#fb923c' },
    { name: 'Completed', value: stats.done, color: '#22c55e' },
    { name: 'Overdue', value: stats.overdue, color: '#ef4444' },
  ];

  return (
    <div className="mb-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {statItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`${item.bgColor} ${item.borderColor} border rounded-lg p-4 transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.title}</p>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${item.color}`} />
              </div>
            </div>
          );
        })}
      </div>
      {/* Analytics Chart */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Task Analytics</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
              {chartData.map((entry, idx) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
