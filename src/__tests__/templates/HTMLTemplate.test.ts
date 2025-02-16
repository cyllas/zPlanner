import { HTMLTemplate } from '../../templates/HTMLTemplate';
import { IProject } from '../../interfaces/IProject';

describe('HTMLTemplate', () => {
  let template: HTMLTemplate;
  let project: IProject;

  beforeEach(() => {
    template = new HTMLTemplate();
    project = {
      project: 'Projeto Teste',
      last_update: new Date().toLocaleDateString('pt-BR'),
      phases: {}
    };
  });

  describe('generateHTML', () => {
    it('deve gerar HTML para projeto vazio', () => {
      const html = template.generateHTML(project);
      
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<title>Projeto Teste</title>');
      expect(html).toContain('Projeto Teste');
      expect(html).toContain('Última Atualização:');
      expect(html).not.toContain('fase-item');
    });

    it('deve gerar HTML com fases e tarefas', () => {
      project.phases = {
        'fase1': {
          name: 'Fase 1',
          executed: false,
          tasks: [
            {
              id: '1.1',
              name: 'Tarefa 1',
              executed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        }
      };

      const html = template.generateHTML(project);
      
      expect(html).toContain('Fase 1');
      expect(html).toContain('Tarefa 1');
      expect(html).toContain('fase');
      expect(html).toContain('tarefa');
    });

    it('deve gerar HTML com subtarefas', () => {
      project.phases = {
        'fase1': {
          name: 'Fase 1',
          executed: false,
          tasks: [
            {
              id: '1.1',
              name: 'Tarefa 1',
              executed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              subtasks: [
                {
                  id: '1.1.1',
                  name: 'Subtarefa 1',
                  executed: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ]
            }
          ]
        }
      };

      const html = template.generateHTML(project);
      
      expect(html).toContain('Subtarefa 1');
      expect(html).toContain('subtarefa');
      expect(html).toContain('subtarefa--concluida');
    });

    it('deve gerar HTML com múltiplos níveis de subtarefas', () => {
      project.phases = {
        'fase1': {
          name: 'Fase 1',
          executed: false,
          tasks: [
            {
              id: '1.1',
              name: 'Tarefa 1',
              executed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              subtasks: [
                {
                  id: '1.1.1',
                  name: 'Subtarefa 1',
                  executed: false,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  subtasks: [
                    {
                      id: '1.1.1.1',
                      name: 'Subtarefa 1.1',
                      executed: true,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    }
                  ]
                }
              ]
            }
          ]
        }
      };

      const html = template.generateHTML(project);
      
      expect(html).toContain('Subtarefa 1.1');
      expect(html).toContain('subtarefa__subtarefas');
    });

    it('deve aplicar classes corretas para itens concluídos', () => {
      project.phases = {
        'fase1': {
          name: 'Fase 1',
          executed: true,
          tasks: [
            {
              id: '1.1',
              name: 'Tarefa 1',
              executed: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              subtasks: [
                {
                  id: '1.1.1',
                  name: 'Subtarefa 1',
                  executed: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ]
            }
          ]
        }
      };

      const html = template.generateHTML(project);
      
      expect(html).toContain('fase--concluida');
      expect(html).toContain('tarefa--concluida');
      expect(html).toContain('subtarefa--concluida');
    });

    it('deve incluir informações de progresso da fase', () => {
      project.phases = {
        'fase1': {
          name: 'Fase 1',
          executed: false,
          tasks: [
            {
              id: '1.1',
              name: 'Tarefa 1',
              executed: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: '1.2',
              name: 'Tarefa 2',
              executed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        }
      };

      const html = template.generateHTML(project);
      
      expect(html).toContain('fase__progresso');
      expect(html).toContain('50%');
    });

    it('deve gerar HTML com caracteres especiais escapados', () => {
      project.phases = {
        'fase1': {
          name: 'Fase & Teste',
          executed: false,
          tasks: [
            {
              id: '1.1',
              name: 'Tarefa < > "',
              executed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        }
      };

      const html = template.generateHTML(project);
      
      expect(html).toContain('Fase &amp; Teste');
      expect(html).toContain('Tarefa &lt; &gt; &quot;');
    });
  });
});
