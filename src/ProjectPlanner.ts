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
        this.saveProject(defaultProject);
        return defaultProject;
      }

      const content = readFileSync(this.filePath, 'utf-8');
      const project = JSON.parse(content);
      return project || this.createDefaultProject();

    } catch (error) {
      const defaultProject = this.createDefaultProject();
      this.saveProject(defaultProject);
      return defaultProject;
    }
  }

  private saveProject(project: Project): void {
    try {
      writeFileSync(
        this.filePath,
        JSON.stringify(project, null, 2),
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

    if (totalTasks === 0) return { tasks: 0, phases: 0 };

    return {
      tasks: Number(((completedTasks / totalTasks) * 100).toFixed(1)),
      phases: totalPhases === 0 ? 0 : Number(((completedPhases / totalPhases) * 100).toFixed(1))
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
    phase.executed = phase.tasks.every(t => t.executed);

    this.project.last_update = new Date().toLocaleDateString('pt-BR');
    this.saveProject(this.project);
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
    this.saveProject(this.project);
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
    this.saveProject(this.project);
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
    this.saveProject(this.project);
  }

  public removePhase(phaseId: string): void {
    if (!this.project.phases[phaseId]) {
      throw new Error(`Fase "${phaseId}" não encontrada`);
    }

    delete this.project.phases[phaseId];

    this.project.last_update = new Date().toLocaleDateString('pt-BR');
    this.saveProject(this.project);
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
    this.saveProject(this.project);
  }
}
