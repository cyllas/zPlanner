export { ProjectPlanner } from './ProjectPlanner';

// Tipos exportados
export interface Task {
  id: string;
  name: string;
  executed: boolean;
}

export interface Phase {
  name: string;
  executed: boolean;
  tasks: Task[];
}

export interface Project {
  project: string;
  last_update: string;
  phases: Record<string, Phase>;
}
