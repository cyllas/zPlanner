import { IProject } from './IProject';

export interface IProjectRepository {
  load(): IProject;
  save(project: IProject): void;
}
