export interface Goal {
  id: string;
  goal: string;
  motivation: string;
  consequences: string;
  benefits: string;
  createdAt: string;
  tasks: Task[];
  progress: Progress[];
}

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Progress {
  date: string;
  mood: number; // 1-10
  focus: number; // 1-10
  completedTasks: string[]; // Task IDs
  notes?: string;
}

export interface GoalState {
  currentGoal: Goal | null;
  loading: boolean;
  error: string | null;
} 