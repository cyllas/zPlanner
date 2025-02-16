import { IProject } from '../../interfaces/IProject';
import { ProgressCalculator } from './ProgressCalculator';
import { StatusAnalyzer } from './StatusAnalyzer';

interface IPhaseProgress {
  nome: string;
  progresso: number;
  status: 'não iniciada' | 'em andamento' | 'concluída';
  tarefas: {
    pendentes: number;
    emAndamento: number;
    concluidas: number;
  };
}

export class ProgressReporter {
  constructor(
    private calculator: ProgressCalculator,
    private analyzer: StatusAnalyzer
  ) {}

  public getDetailedProgress(project: IProject): {
    geral: { tasks: number; phases: number };
    fases: Record<string, IPhaseProgress>;
  } {
    const progress = this.calculator.calculateProjectProgress(project);
    const fases: Record<string, IPhaseProgress> = {};

    Object.entries(project.phases).forEach(([phaseId, phase]) => {
      const phaseStatus = this.analyzer.getPhaseStatus(phase);
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

  public getBasicProgress(project: IProject): { tasks: number; phases: number } {
    const progress = this.calculator.calculateProjectProgress(project);
    return {
      tasks: progress.tasks.percentage,
      phases: progress.phases.percentage
    };
  }
}
