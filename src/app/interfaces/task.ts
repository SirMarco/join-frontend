export interface TaskItem {
  title: string;
  description: string;
  assigned_to: AssignedTo[];
  due_date: string;
  priority: 'Low' | 'Medium' | 'Urgent';
  category: number;
  subtasks: SubTaskItem[];
  users: number[];
}

export interface SubTaskItem {
  title: string;
  completed: boolean;
}
export interface AssignedTo {
  first_name: string[];
  last_name: string[];
  email: string[];
  phone: string[];
  user: string[];
}
