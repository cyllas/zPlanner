import { IProject } from '../interfaces/IProject';
import { IProjectRepository } from '../interfaces/IProjectRepository';
import { TaskService } from './TaskService';
import { PhaseService } from './PhaseService';
import { ProgressService } from './ProgressService';

export class ProjectService {
  private project: IProject;
  private taskService: TaskService;
  private phaseService: PhaseService;
  private progressService: ProgressService;

  constructor(
    private repository: IProjectRepository,
    taskService?: TaskService,
    phaseService?: PhaseService,
    progressService?: ProgressService
  ) {
    this.project = this.repository.load();
    this.taskService = taskService || new TaskService();
    this.phaseService = phaseService || new PhaseService();
    this.progressService = progressService || new ProgressService(this.taskService, this.phaseService);
  }

  public addPhase(id: string, name: string): void {
    if (this.project.phases[id]) {
      throw new Error(`Fase ${id} já existe`);
    }

    this.project.phases[id] = this.phaseService.createPhase(name);
    this.updateAndSave();
  }

  public renamePhase(id: string, newName: string): void {
    const phase = this.project.phases[id];
    if (!phase) {
      throw new Error(`Fase ${id} não encontrada`);
    }

    this.phaseService.renamePhase(phase, newName);
    this.updateAndSave();
  }

  public movePhase(id: string, newPosition: number): void {
    if (this.phaseService.movePhase(this.project, id, newPosition)) {
      this.updateAndSave();
    } else {
      throw new Error(`Não foi possível mover a fase ${id}`);
    }
  }

  public removePhase(id: string): void {
    if (this.phaseService.removePhase(this.project, id)) {
      this.updateAndSave();
    } else {
      throw new Error(`Fase ${id} não encontrada`);
    }
  }

  public addTask(phaseId: string, taskId: string, name: string): void {
    const phase = this.project.phases[phaseId];
    if (!phase) {
      throw new Error(`Fase ${phaseId} não encontrada`);
    }

    const task = this.taskService.createTask(taskId, name);
    phase.tasks.push(task);
    this.updateAndSave();
  }

  public addSubtask(phaseId: string, parentTaskId: string, subtaskId: string, name: string): void {
    const { task: parentTask } = this.taskService.findTask(this.project, phaseId, parentTaskId);
    
    if (!parentTask) {
      throw new Error(`Tarefa pai ${parentTaskId} não encontrada na fase ${phaseId}`);
    }

    if (!parentTask.subtasks) {
      parentTask.subtasks = [];
    }

    const subtask = this.taskService.createTask(subtaskId, name, parentTaskId);
    parentTask.subtasks.push(subtask);
    this.updateAndSave();
  }

  public moveTask(sourcePhaseId: string, targetPhaseId: string, taskId: string): void {
    const sourcePhase = this.project.phases[sourcePhaseId];
    const targetPhase = this.project.phases[targetPhaseId];

    if (!sourcePhase || !targetPhase) {
      throw new Error('Fase de origem ou destino não encontrada');
    }

    const targetPosition = targetPhase.tasks.length;
    if (this.taskService.moveTaskBetweenPhases(sourcePhase, targetPhase, taskId, targetPosition)) {
      this.updateAndSave();
    } else {
      throw new Error(`Tarefa ${taskId} não encontrada na fase ${sourcePhaseId}`);
    }
  }

  public completeTask(phaseId: string, taskId: string): void {
    const { task } = this.taskService.findTask(this.project, phaseId, taskId);
    if (!task) {
      throw new Error(`Tarefa ${taskId} não encontrada na fase ${phaseId}`);
    }

    this.taskService.updateTaskStatus(task, true);
    this.updateAndSave();
  }

  public pendingTask(phaseId: string, taskId: string): void {
    const { task } = this.taskService.findTask(this.project, phaseId, taskId);
    if (!task) {
      throw new Error(`Tarefa ${taskId} não encontrada na fase ${phaseId}`);
    }

    this.taskService.updateTaskStatus(task, false);
    this.updateAndSave();
  }

  public getProgress(): { tasks: number; phases: number } {
    const progress = this.progressService.calculateProjectProgress(this.project);
    return {
      tasks: progress.tasks.percentage,
      phases: progress.phases.percentage
    };
  }

  public getDetailedProgress(): {
    geral: { tasks: number; phases: number };
    fases: Record<string, { nome: string; progresso: number; status: string; tarefas: { pendentes: number; emAndamento: number; concluidas: number } }>;
  } {
    return this.progressService.getDetailedProgress(this.project);
  }

  private updateAndSave(): void {
    this.project.last_update = new Date().toLocaleDateString('pt-BR');
    this.repository.save(this.project);
  }

  public getProject(): IProject {
    return this.project;
  }
}
