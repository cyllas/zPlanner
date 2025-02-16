import { IPhase } from './IPhase';

export interface IProject {
  project: string;
  last_update: string;
  phases: Record<string, IPhase>;
}
