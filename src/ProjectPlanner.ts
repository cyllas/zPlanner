import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

interface Task {
  id: string;
  name: string;
  executed: boolean;
}

interface Phase {
  name: string;
  executed: boolean;
  tasks: Task[];
}

interface Project {
  project: string;
  last_update: string;
  phases: Record<string, Phase>;
}

export class ProjectPlanner {
  private project: Project;
  private filePath: string;

  constructor(projectPath: string) {
    this.filePath = resolve(projectPath);
    this.project = this.loadProject();
  }

  private createDefaultProject(): Project {
    return {
      project: "Novo Projeto",
      last_update: new Date().toLocaleDateString('pt-BR'),
      phases: {}
    };
  }

  private loadProject(): Project {
    try {
      if (!existsSync(this.filePath)) {
        const defaultProject = this.createDefaultProject();
        writeFileSync(
          this.filePath,
          JSON.stringify(defaultProject, null, 2),
          'utf-8'
        );
        return defaultProject;
      }

      const content = readFileSync(this.filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Erro ao carregar projeto: ${error}`);
    }
  }

  private saveProject(): void {
    try {
      writeFileSync(
        this.filePath,
        JSON.stringify(this.project, null, 2),
        'utf-8'
      );
    } catch (error) {
      throw new Error(`Erro ao salvar projeto: ${error}`);
    }
  }

  public getProgress(): { tasks: number; phases: number } {
    const phases = Object.values(this.project.phases);
    const totalPhases = phases.length;
    const completedPhases = phases.filter(phase => phase.executed).length;

    const tasks = phases.flatMap(phase => phase.tasks);
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.executed).length;

    return {
      tasks: Number(((completedTasks / totalTasks) * 100).toFixed(1)),
      phases: Number(((completedPhases / totalPhases) * 100).toFixed(1))
    };
  }

  public listTasks(): { phaseId: string; phase: Phase }[] {
    return Object.entries(this.project.phases).map(([phaseId, phase]) => ({
      phaseId,
      phase
    }));
  }

  public completeTask(phaseId: string, taskId: string): void {
    const phase = this.project.phases[phaseId];
    if (!phase) {
      throw new Error(`Fase "${phaseId}" não encontrada`);
    }

    const task = phase.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Tarefa "${taskId}" não encontrada na fase "${phaseId}"`);
    }

    task.executed = true;
    
    // Verifica se todas as tarefas da fase foram concluídas
    const allTasksCompleted = phase.tasks.every(t => t.executed);
    if (allTasksCompleted) {
      phase.executed = true;
    }

    this.project.last_update = new Date().toLocaleDateString('pt-BR');
    this.saveProject();
  }

  public pendingTask(phaseId: string, taskId: string): void {
    const phase = this.project.phases[phaseId];
    if (!phase) {
      throw new Error(`Fase "${phaseId}" não encontrada`);
    }

    const task = phase.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Tarefa "${taskId}" não encontrada na fase "${phaseId}"`);
    }

    task.executed = false;
    phase.executed = false;

    this.project.last_update = new Date().toLocaleDateString('pt-BR');
    this.saveProject();
  }

  public addPhase(phaseId: string, name: string): void {
    if (this.project.phases[phaseId]) {
      throw new Error(`Fase "${phaseId}" já existe`);
    }

    this.project.phases[phaseId] = {
      name,
      executed: false,
      tasks: []
    };

    this.project.last_update = new Date().toLocaleDateString('pt-BR');
    this.saveProject();
  }

  public addTask(phaseId: string, taskId: string, name: string): void {
    const phase = this.project.phases[phaseId];
    if (!phase) {
      throw new Error(`Fase "${phaseId}" não encontrada`);
    }

    if (phase.tasks.some(t => t.id === taskId)) {
      throw new Error(`Tarefa "${taskId}" já existe na fase "${phaseId}"`);
    }

    phase.tasks.push({
      id: taskId,
      name,
      executed: false
    });

    this.project.last_update = new Date().toLocaleDateString('pt-BR');
    this.saveProject();
  }

  public removePhase(phaseId: string): void {
    if (!this.project.phases[phaseId]) {
      throw new Error(`Fase "${phaseId}" não encontrada`);
    }

    delete this.project.phases[phaseId];

    this.project.last_update = new Date().toLocaleDateString('pt-BR');
    this.saveProject();
  }

  public removeTask(phaseId: string, taskId: string): void {
    const phase = this.project.phases[phaseId];
    if (!phase) {
      throw new Error(`Fase "${phaseId}" não encontrada`);
    }

    const taskIndex = phase.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`Tarefa "${taskId}" não encontrada na fase "${phaseId}"`);
    }

    phase.tasks.splice(taskIndex, 1);

    this.project.last_update = new Date().toLocaleDateString('pt-BR');
    this.saveProject();
  }
}
