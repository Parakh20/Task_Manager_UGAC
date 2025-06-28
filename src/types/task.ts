export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
}

export interface TaskComment {
  id: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
  status: 'Todo' | 'In Progress' | 'Done';
  createdAt: string;
  updatedAt: string;
  subtasks?: Subtask[];
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
}
