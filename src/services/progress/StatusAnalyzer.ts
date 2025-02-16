import { IPhase } from '../../interfaces/IPhase';
import { IStatusAnalyzer } from './interfaces/IStatusAnalyzer';
import { PhaseService } from '../PhaseService';

export class StatusAnalyzer implements IStatusAnalyzer {
  constructor(private phaseService: PhaseService) {}

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
}
