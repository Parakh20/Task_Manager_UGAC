'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import TaskModal from '@/components/tasks/TaskModal';
import { useTask } from '@/context/TaskContext';
import { Task } from '@/types/task';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function getPrevMonth(year: number, month: number) {
  if (month === 0) return { year: year - 1, month: 11 };
  return { year, month: month - 1 };
}

function getNextMonth(year: number, month: number) {
  if (month === 11) return { year: year + 1, month: 0 };
  return { year, month: month + 1 };
}

// Priority color mapping to match your vanilla JS app
function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-orange-400';
    case 'low':
      return 'bg-yellow-400 text-black';
    default:
      return 'bg-blue-500';
  }
}

export default function CalendarPage() {
  const { tasks } = useTask();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Get all days to display (previous, current, next month for a full grid)
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const prevMonthInfo = getPrevMonth(currentYear, currentMonth);
  const prevMonthDays = getDaysInMonth(prevMonthInfo.year, prevMonthInfo.month);

  // Calculate days for the grid
  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  // Previous month days
  for (let i = firstDayOfWeek; i > 0; i--) {
    days.push({
      date: new Date(prevMonthInfo.year, prevMonthInfo.month, prevMonthDays - i + 1),
      isCurrentMonth: false
    });
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(currentYear, currentMonth, i),
      isCurrentMonth: true
    });
  }
  // Next month days to fill the grid (up to 42 cells)
  const nextDays = 42 - days.length;
  const nextMonthInfo = getNextMonth(currentYear, currentMonth);
  for (let i = 1; i <= nextDays; i++) {
    days.push({
      date: new Date(nextMonthInfo.year, nextMonthInfo.month, i),
      isCurrentMonth: false
    });
  }

  // Helper for date string (YYYY-MM-DD)
  // function formatDate(date: Date) {
  //   return date.toISOString().slice(0, 10);
  // }
  function formatDate(date: Date) {
  // Always returns YYYY-MM-DD in the user's local time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

  // Navigation functions
  function goToPrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function goToNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  function goToToday() {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  }

  // Task handling
  function handleTaskClick(task: Task) {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  function handleDayClick(dateStr: string) {
    setSelectedDate(dateStr);
    setEditingTask(null);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingTask(null);
    setSelectedDate(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Calendar</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={goToPrevMonth}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              ‹
            </button>
            <span className="text-xl font-semibold text-gray-900 dark:text-gray-100 min-w-[200px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button 
              onClick={goToNextMonth}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              ›
            </button>
            <button 
              onClick={goToToday}
              className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700"
            >
              Today
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center font-semibold text-gray-700 dark:text-gray-300">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days.map(({ date, isCurrentMonth }, idx) => {
              const dateStr = formatDate(date);
              const dayTasks = tasks.filter(task => task.dueDate?.slice(0, 10) === dateStr);
              const isToday =
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();

              return (
                <div
                  key={idx}
                  className={`min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors
                    ${isCurrentMonth 
                      ? 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800' 
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                    }
                    ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' : ''}
                  `}
                  onClick={() => handleDayClick(dateStr)}
                >
                  <div className={`font-medium text-sm mb-2 ${
                    isToday
                      ? 'text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-black dark:text-white'
                  }`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.map(task => (
                      <div
                        key={task.id}
                        className={`px-2 py-1 rounded text-xs font-medium cursor-pointer transition-colors text-white hover:opacity-80 truncate ${getPriorityColor(task.priority)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskClick(task);
                        }}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal
  task={editingTask ?? undefined}
  onClose={handleCloseModal}
  defaultDate={selectedDate}
/>
      )}
    </div>
  );
}
