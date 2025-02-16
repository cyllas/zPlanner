import { HTMLExportService } from '../../services/HTMLExportService';
import { HTMLTemplate } from '../../templates/HTMLTemplate';
import { IProject } from '../../interfaces/IProject';
import fs from 'fs';
import path from 'path';

jest.mock('fs');
jest.mock('../../templates/HTMLTemplate');

describe('HTMLExportService', () => {
  let service: HTMLExportService;
  let htmlTemplate: HTMLTemplate;
  let project: IProject;

  beforeEach(() => {
    htmlTemplate = new HTMLTemplate();
    service = new HTMLExportService(htmlTemplate);
    project = {
      project: 'Projeto Teste',
      last_update: new Date().toLocaleDateString('pt-BR'),
      phases: {}
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('exportToHTML', () => {
    it('deve exportar projeto para HTML', () => {
      const outputPath = path.join('output', 'projeto.html');
      const expectedHTML = '<html>Conteúdo do Projeto</html>';

      jest.spyOn(htmlTemplate, 'generateHTML').mockReturnValue(expectedHTML);
      jest.spyOn(fs, 'writeFileSync').mockImplementation();

      service.exportToHTML(project, outputPath);

      expect(htmlTemplate.generateHTML).toHaveBeenCalledWith(project);
      expect(fs.writeFileSync).toHaveBeenCalledWith(outputPath, expectedHTML);
    });

    it('deve criar diretório se não existir', () => {
      const outputPath = path.join('output', 'subdir', 'projeto.html');
      const expectedHTML = '<html>Conteúdo do Projeto</html>';

      jest.spyOn(htmlTemplate, 'generateHTML').mockReturnValue(expectedHTML);
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      jest.spyOn(fs, 'mkdirSync').mockImplementation();
      jest.spyOn(fs, 'writeFileSync').mockImplementation();

      service.exportToHTML(project, outputPath);

      expect(htmlTemplate.generateHTML).toHaveBeenCalledWith(project);
      expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(outputPath), { recursive: true });
      expect(fs.writeFileSync).toHaveBeenCalledWith(outputPath, expectedHTML);
    });

    it('deve lançar erro se falhar ao criar diretório', () => {
      const outputPath = path.join('output', 'subdir', 'projeto.html');
      const expectedHTML = '<html>Conteúdo do Projeto</html>';

      jest.spyOn(htmlTemplate, 'generateHTML').mockReturnValue(expectedHTML);
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {
        throw new Error('Erro ao criar diretório');
      });

      expect(() => {
        service.exportToHTML(project, outputPath);
      }).toThrow('Erro ao exportar projeto para HTML: Erro ao criar diretório de saída: Erro ao criar diretório');
    });

    it('deve lançar erro se falhar ao escrever arquivo', () => {
      const outputPath = path.join('output', 'projeto.html');
      const expectedHTML = '<html>Conteúdo do Projeto</html>';

      jest.spyOn(htmlTemplate, 'generateHTML').mockReturnValue(expectedHTML);
      jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
        throw new Error('Erro ao criar diretório de saída: Erro ao criar diretório');
      });

      expect(() => {
        service.exportToHTML(project, outputPath);
      }).toThrow('Erro ao exportar projeto para HTML: Erro ao criar diretório de saída: Erro ao criar diretório');
    });
  });
});
