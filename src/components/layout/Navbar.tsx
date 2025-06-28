'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { useTask } from '@/context/TaskContext';
import { useTheme } from '@/context/ThemeContext';
import {
  CheckSquare,
  Plus,
  Filter,
  Download,
  Upload,
  Trash2,
  BarChart3,
  Menu,
  X,
  Sun,
  Moon,
  PieChart,
  Calendar as CalendarIcon,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { exportTasks, importTasks, clearAllTasks, getTaskStats } = useTask();
  const { dark, toggle } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = getTaskStats();

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importTasks(file);
        alert('Tasks imported successfully!');
      } catch (error) {
        alert('Failed to import tasks. Please check the file format.');
      }
    }
    event.target.value = '';
  };

  const handleClearAll = () => {
    if (
      confirm(
        'Are you sure you want to delete all tasks? This action cannot be undone.'
      )
    ) {
      clearAllTasks();
    }
  };

  // Updated navigation with Calendar added back
  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Analytics', href: '/analytics', icon: PieChart },
    { name: 'Create Task', href: '/create', icon: Plus },
  ];

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <CheckSquare className="h-8 w-8 text-primary-600 dark:text-white" />
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                TaskManager
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'font-bold bg-primary-600 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        isActive
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}

              {/* Quick Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 border-l border-gray-200 dark:border-gray-700 pl-6">
                <span>Total: {stats.total}</span>
                <span className="text-red-600 dark:text-red-400">
                  Overdue: {stats.overdue}
                </span>
              </div>

              {/* More Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Filter className="h-4 w-4" />
                  More
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          exportTasks();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Download className="h-4 w-4" />
                        Export Tasks
                      </button>

                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Upload className="h-4 w-4" />
                        Import Tasks
                      </button>

                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                      <button
                        onClick={() => {
                          handleClearAll();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear All Tasks
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggle}
                className="ml-4 p-2 rounded transition-colors bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Toggle dark mode"
              >
                {dark ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'font-bold bg-primary-600 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        isActive
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
                  Total: {stats.total} | Overdue: {stats.overdue}
                </div>

                <button
                  onClick={() => {
                    exportTasks();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Download className="h-4 w-4" />
                  Export Tasks
                </button>

                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Upload className="h-4 w-4" />
                  Import Tasks
                </button>

                {/* Dark Mode Toggle for Mobile */}
                <button
                  onClick={toggle}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 mt-2"
                  aria-label="Toggle dark mode"
                >
                  {dark ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  )}
                  {dark ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />

      {/* Backdrop for dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  );
}
