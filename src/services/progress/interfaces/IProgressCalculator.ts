import { IProject } from '../../../interfaces/IProject';
import { IPhase } from '../../../interfaces/IPhase';

export interface IProgressCalculator {
  calculateProjectProgress(project: IProject): {
    tasks: { completed: number; total: number; percentage: number };
    phases: { completed: number; total: number; percentage: number };
  };
  
  calculatePhaseProgress(phase: IPhase): {
    completed: number;
    total: number;
    percentage: number;
  };
}
