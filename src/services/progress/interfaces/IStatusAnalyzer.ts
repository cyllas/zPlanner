import { IPhase } from '../../../interfaces/IPhase';

export interface IStatusAnalyzer {
  getPhaseStatus(phase: IPhase): {
    progress: number;
    status: 'não iniciada' | 'em andamento' | 'concluída';
    taskStats: {
      pendentes: number;
      emAndamento: number;
      concluidas: number;
    };
  };
}
