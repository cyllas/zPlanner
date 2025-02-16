import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { IProject } from '../interfaces/IProject';
import { IProjectRepository } from '../interfaces/IProjectRepository';

export class FileProjectRepository implements IProjectRepository {
  private filePath: string;

  constructor(projectPath: string) {
    this.filePath = resolve(projectPath);
  }

  private createDefaultProject(): IProject {
    return {
      project: 'Novo Projeto',
      last_update: new Date().toLocaleDateString('pt-BR'),
      phases: {}
    };
  }

  public load(): IProject {
    try {
      if (!existsSync(this.filePath)) {
        const defaultProject = this.createDefaultProject();
        this.save(defaultProject);
        return defaultProject;
      }

      const content = readFileSync(this.filePath, 'utf-8');
      return JSON.parse(content) || this.createDefaultProject();
    } catch (error) {
      return this.createDefaultProject();
    }
  }

  public save(project: IProject): void {
    writeFileSync(this.filePath, JSON.stringify(project, null, 2));
  }
}
