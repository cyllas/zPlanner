import { ITask } from '../interfaces/ITask';
import { IProject } from '../interfaces/IProject';
import { IPhase } from '../interfaces/IPhase';

export class TaskService {
  public findTask(project: IProject, phaseId: string, taskId: string): { task: ITask | null; phase: IPhase | null } {
    const phase = project.phases[phaseId];
    if (!phase) return { task: null, phase: null };

    const findTaskRecursive = (tasks: ITask[]): ITask | null => {
      for (const task of tasks) {
        if (task.id === taskId) return task;
        if (task.subtasks) {
          const found = findTaskRecursive(task.subtasks);
          if (found) return found;
        }
      }
      return null;
    };

    return { task: findTaskRecursive(phase.tasks), phase };
  }

  public createTask(id: string, name: string, parentId?: string): ITask {
    return {
      id,
      name,
      executed: false,
      parentId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  public addTask(phase: IPhase, id: string, name: string): void {
    const task = this.createTask(id, name);
    phase.tasks.push(task);
  }

  public updateTaskStatus(task: ITask, executed: boolean): void {
    task.executed = executed;
    task.updated_at = new Date().toISOString();
  }

  public renameTask(task: ITask, newName: string): void {
    task.name = newName;
    task.updated_at = new Date().toISOString();
  }

  public moveTask(phase: IPhase, taskId: string, newPosition: number): boolean {
    const taskIndex = phase.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1 || newPosition < 0 || newPosition >= phase.tasks.length) {
      return false;
    }

    const [task] = phase.tasks.splice(taskIndex, 1);
    phase.tasks.splice(newPosition, 0, task);
    return true;
  }

  public moveTaskBetweenPhases(sourcePhase: IPhase, targetPhase: IPhase, taskId: string, newPosition: number): boolean {
    const taskIndex = sourcePhase.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1 || newPosition < 0 || newPosition > targetPhase.tasks.length) {
      return false;
    }

    const [task] = sourcePhase.tasks.splice(taskIndex, 1);
    targetPhase.tasks.splice(newPosition, 0, task);
    return true;
  }

  public findTaskById(phase: IPhase, taskId: string): ITask | undefined {
    return phase.tasks.find(t => t.id === taskId);
  }
}
