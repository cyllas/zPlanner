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

// Serviços principais
export { ProjectService } from './services/ProjectService';
export { TaskService } from './services/TaskService';
export { PhaseService } from './services/PhaseService';
export { ProgressService } from './services/progress/ProgressService';

// Serviços de exportação
export { HTMLExportService } from './services/HTMLExportService';
export { HTMLTemplate } from './templates/HTMLTemplate';
export { StyleTemplate } from './templates/StyleTemplate';

// Repositórios
export { FileProjectRepository } from './repositories/FileProjectRepository';

// Interfaces
export { ITask } from './interfaces/ITask';
export { IPhase } from './interfaces/IPhase';
export { IProject } from './interfaces/IProject';
export { IProjectRepository } from './interfaces/IProjectRepository';
