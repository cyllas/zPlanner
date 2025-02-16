import { IProject } from '../interfaces/IProject';
import { IPhase } from '../interfaces/IPhase';
import { ITask } from '../interfaces/ITask';
import { TaskService } from './TaskService';
import { PhaseService } from './PhaseService';

export class ProgressService {
  constructor(
    private taskService: TaskService,
    private phaseService: PhaseService
  ) {}

  public calculateProjectProgress(project: IProject): {
    tasks: { completed: number; total: number; percentage: number };
    phases: { completed: number; total: number; percentage: number };
  } {
    let tasksCompleted = 0;
    let tasksTotal = 0;
    let phasesCompleted = 0;
    const phasesTotal = Object.keys(project.phases).length;

    Object.values(project.phases).forEach(phase => {
      const phaseProgress = this.phaseService.calculatePhaseProgress(phase);
      tasksCompleted += phaseProgress.completed;
      tasksTotal += phaseProgress.total;

      if (phaseProgress.completed === phaseProgress.total && phaseProgress.total > 0) {
        phasesCompleted++;
      }
    });

    return {
      tasks: {
        completed: tasksCompleted,
        total: tasksTotal,
        percentage: tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0
      },
      phases: {
        completed: phasesCompleted,
        total: phasesTotal,
        percentage: phasesTotal > 0 ? (phasesCompleted / phasesTotal) * 100 : 0
      }
    };
  }

  public getPhaseStatus(phase: IPhase): {
    progress: number;
    status: 'não iniciada' | 'em andamento' | 'concluída';
    taskStats: { pendentes: number; emAndamento: number; concluidas: number };
  } {
    const progress = this.phaseService.calculatePhaseProgress(phase);
    const percentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

    const pendentes = phase.tasks.filter(t => !t.executed).length;
    const concluidas = phase.tasks.filter(t => t.executed).length;
    const emAndamento = phase.tasks.length - (pendentes + concluidas);

    let status: 'não iniciada' | 'em andamento' | 'concluída' = 'não iniciada';
    if (percentage === 100) {
      status = 'concluída';
    } else if (percentage > 0) {
      status = 'em andamento';
    }

    return {
      progress: percentage,
      status,
      taskStats: {
        pendentes,
        emAndamento,
        concluidas
      }
    };
  }

  public getDetailedProgress(project: IProject): {
    geral: { tasks: number; phases: number };
    fases: Record<string, { nome: string; progresso: number; status: string; tarefas: any }>;
  } {
    const progress = this.calculateProjectProgress(project);
    const fases: Record<string, any> = {};

    Object.entries(project.phases).forEach(([phaseId, phase]) => {
      const phaseStatus = this.getPhaseStatus(phase);
      fases[phaseId] = {
        nome: phase.name,
        progresso: phaseStatus.progress,
        status: phaseStatus.status,
        tarefas: phaseStatus.taskStats
      };
    });

    return {
      geral: {
        tasks: progress.tasks.percentage,
        phases: progress.phases.percentage
      },
      fases
    };
  }
}
