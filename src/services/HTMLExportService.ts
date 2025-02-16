import { IProject } from '../interfaces/IProject';
import { HTMLTemplate } from '../templates/HTMLTemplate';
import fs from 'fs';
import path from 'path';

export class HTMLExportService {
  constructor(private htmlTemplate: HTMLTemplate) {}

  public exportToHTML(project: IProject, outputPath: string): void {
    try {
      this.ensureDirectoryExists(outputPath);
      const html = this.htmlTemplate.generateHTML(project);
      fs.writeFileSync(outputPath, html);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro ao exportar projeto para HTML: ${error.message}`);
      }
      throw error;
    }
  }

  private ensureDirectoryExists(filePath: string): void {
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
      try {
        fs.mkdirSync(directory, { recursive: true });
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Erro ao criar diretório de saída: ${error.message}`);
        }
        throw error;
      }
    }
  }
}
