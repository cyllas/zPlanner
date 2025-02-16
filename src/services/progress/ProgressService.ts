import { IPhase } from '../../interfaces/IPhase';
import { IProject } from '../../interfaces/IProject';
import { PhaseService } from '../PhaseService';
import { TaskService } from '../TaskService';
import { ProgressCalculator } from './ProgressCalculator';
import { IProgressCalculator } from './interfaces/IProgressCalculator';

interface ITaskStats {
  pendentes: number;
  emAndamento: number;
  concluidas: number;
}

interface IProgressStats {
  completed: number;
  total: number;
  percentage: number;
}

export class ProgressService {
  private calculator: IProgressCalculator;

  constructor(
    private taskService: TaskService,
    private phaseService: PhaseService
  ) {
    this.calculator = new ProgressCalculator(phaseService);
  }

  /**
   * Calcula o progresso total do projeto
   * @param project Projeto a ser analisado
   * @returns Objeto com estatísticas de progresso
   */
  public calculateProjectProgress(project: IProject): {
    tasks: IProgressStats;
    phases: IProgressStats;
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

  /**
   * Retorna o status detalhado de uma fase
   * @param phase Fase a ser analisada
   * @returns Objeto com progresso, status e estatísticas
   */
  public getPhaseStatus(phase: IPhase): {
    progress: number;
    status: 'não iniciada' | 'em andamento' | 'concluída';
    taskStats: ITaskStats;
  } {
    const progress = this.phaseService.calculatePhaseProgress(phase);
    const percentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

    let status: 'não iniciada' | 'em andamento' | 'concluída' = 'não iniciada';
    if (percentage === 100) {
      status = 'concluída';
    } else if (percentage > 0) {
      status = 'em andamento';
    }

    const taskStats = {
      pendentes: phase.tasks.filter(t => !t.executed).length,
      emAndamento: phase.tasks.filter(t => !t.executed && t.id !== '').length,
      concluidas: phase.tasks.filter(t => t.executed).length
    };

    return {
      progress: percentage,
      status,
      taskStats
    };
  }

  /**
   * Gera um relatório detalhado do progresso do projeto
   * @param project Projeto a ser analisado
   * @returns Objeto com informações detalhadas de progresso
   */
  public getDetailedProgress(project: IProject): {
    projectProgress: {
      tasks: IProgressStats;
      phases: IProgressStats;
    };
    phaseDetails: Record<string, {
      progress: number;
      status: 'não iniciada' | 'em andamento' | 'concluída';
      taskStats: ITaskStats;
    }>;
  } {
    const projectProgress = this.calculateProjectProgress(project);
    const phaseDetails: Record<string, {
      progress: number;
      status: 'não iniciada' | 'em andamento' | 'concluída';
      taskStats: ITaskStats;
    }> = {};

    Object.entries(project.phases).forEach(([phaseName, phase]) => {
      phaseDetails[phaseName] = this.getPhaseStatus(phase);
    });

    return {
      projectProgress,
      phaseDetails
    };
  }
}
