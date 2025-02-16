import { IProject } from '../../../interfaces/IProject';

export interface IProjectManager {
  getProject(): IProject;
  save(): void;
  validate(operation: string, ...args: any[]): void;
}
