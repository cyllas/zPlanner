import { IPhase } from '../interfaces/IPhase';
import { IProject } from '../interfaces/IProject';

export class PhaseService {
  public createPhase(name: string): IPhase {
    return {
      name,
      executed: false,
      tasks: []
    };
  }

  public renamePhase(phase: IPhase, newName: string): void {
    phase.name = newName;
  }

  public movePhase(project: IProject, phaseId: string, newPosition: number): boolean {
    const phases = Object.entries(project.phases);
    const currentIndex = phases.findIndex(([id]) => id === phaseId);
    
    if (currentIndex === -1 || newPosition < 0 || newPosition >= phases.length) {
      return false;
    }

    const [movedPhaseId, movedPhase] = phases[currentIndex];
    phases.splice(currentIndex, 1);
    phases.splice(newPosition, 0, [movedPhaseId, movedPhase]);

    // Reconstruir o objeto phases
    project.phases = phases.reduce((acc, [id, phase]) => {
      acc[id] = phase;
      return acc;
    }, {} as Record<string, IPhase>);

    return true;
  }

  public removePhase(project: IProject, phaseId: string): boolean {
    if (!project.phases[phaseId]) return false;
    delete project.phases[phaseId];
    return true;
  }

  public calculatePhaseProgress(phase: IPhase): { completed: number; total: number; percentage: number } {
    let completed = 0;
    let total = 0;

    const countTasks = (tasks: any[]) => {
      for (const task of tasks) {
        total++;
        if (task.executed) completed++;
        if (task.subtasks) {
          countTasks(task.subtasks);
        }
      }
    };

    countTasks(phase.tasks);
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return { completed, total, percentage };
  }
}
