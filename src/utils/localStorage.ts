import { Task } from '@/types/task';

const TASKS_STORAGE_KEY = 'task-manager-tasks';

export const storage = {
  getTasks: (): Task[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading tasks from localStorage:', error);
      return [];
    }
  },

  saveTasks: (tasks: Task[]): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  },

  clearTasks: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(TASKS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing tasks from localStorage:', error);
    }
  },

  exportTasks: (): void => {
    const tasks = storage.getTasks();
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },

  importTasks: (file: File): Promise<Task[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const tasks = JSON.parse(content) as Task[];
          resolve(tasks);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
};
