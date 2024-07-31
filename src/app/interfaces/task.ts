export interface TaskItem {
  title: string;
  description: string;
  assigned_to: number[];
  due_date: string;
  priority: 'Low' | 'Medium' | 'Urgent';
  category: number;
  subtasks: string[];
  users: number[];
}
