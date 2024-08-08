export interface TaskItem {
  title: string;
  description: string;
  due_date: string;
  priority: 'Low' | 'Medium' | 'Urgent';
  category: number;
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
