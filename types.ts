
export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Error = 'Error',
}

export interface Task {
  id: number;
  description: string;
  agent: string;
  status: TaskStatus;
  summary: string;
}
