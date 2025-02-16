import { PhaseService } from '../../services/PhaseService';
import { IPhase } from '../../interfaces/IPhase';
import { IProject } from '../../interfaces/IProject';

describe('PhaseService', () => {
  let service: PhaseService;
  let phase: IPhase;
  let project: IProject;

  beforeEach(() => {
    service = new PhaseService();
    phase = service.createPhase('Fase de Teste');
    project = {
      project: 'Projeto Teste',
      last_update: new Date().toLocaleDateString('pt-BR'),
      phases: {}
    };
  });

  describe('createPhase', () => {
    it('deve criar uma nova fase', () => {
      const newPhase = service.createPhase('Nova Fase');
      expect(newPhase.name).toBe('Nova Fase');
      expect(newPhase.executed).toBe(false);
      expect(newPhase.tasks).toEqual([]);
    });
  });

  describe('renamePhase', () => {
    it('deve renomear uma fase existente', () => {
      service.renamePhase(phase, 'Novo Nome');
      expect(phase.name).toBe('Novo Nome');
    });
  });

  describe('movePhase', () => {
    it('deve mover uma fase para nova posição', () => {
      project.phases = {
        'fase1': service.createPhase('Fase 1'),
        'fase2': service.createPhase('Fase 2'),
        'fase3': service.createPhase('Fase 3')
      };

      const result = service.movePhase(project, 'fase1', 2);
      expect(result).toBe(true);
    });

    it('deve retornar false ao tentar mover fase inexistente', () => {
      const result = service.movePhase(project, 'fase_inexistente', 1);
      expect(result).toBe(false);
    });
  });

  describe('removePhase', () => {
    it('deve remover uma fase existente', () => {
      project.phases = {
        'fase1': service.createPhase('Fase 1')
      };

      const result = service.removePhase(project, 'fase1');
      expect(result).toBe(true);
      expect(project.phases['fase1']).toBeUndefined();
    });

    it('deve retornar false ao tentar remover fase inexistente', () => {
      const result = service.removePhase(project, 'fase_inexistente');
      expect(result).toBe(false);
    });
  });

  describe('calculatePhaseProgress', () => {
    it('deve calcular progresso com tarefas simples', () => {
      phase.tasks = [
        { 
          id: '1', 
          name: 'Tarefa 1', 
          executed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'Tarefa 2', 
          executed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      const progress = service.calculatePhaseProgress(phase);
      expect(progress.completed).toBe(1);
      expect(progress.total).toBe(2);
      expect(progress.percentage).toBe(50);
    });

    it('deve calcular progresso com subtarefas', () => {
      phase.tasks = [
        {
          id: '1',
          name: 'Tarefa 1',
          executed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          subtasks: [
            { 
              id: '1.1', 
              name: 'Subtarefa 1.1', 
              executed: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            { 
              id: '1.2', 
              name: 'Subtarefa 1.2', 
              executed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        }
      ];

      const progress = service.calculatePhaseProgress(phase);
      expect(progress.completed).toBe(2);
      expect(progress.total).toBe(3);
      expect(progress.percentage).toBe(66.66666666666666);
    });

    it('deve calcular progresso com múltiplos níveis de subtarefas', () => {
      phase.tasks = [
        {
          id: '1',
          name: 'Tarefa 1',
          executed: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          subtasks: [
            {
              id: '1.1',
              name: 'Subtarefa 1.1',
              executed: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              subtasks: [
                { 
                  id: '1.1.1', 
                  name: 'Subtarefa 1.1.1', 
                  executed: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ]
            }
          ]
        }
      ];

      const progress = service.calculatePhaseProgress(phase);
      expect(progress.completed).toBe(3);
      expect(progress.total).toBe(3);
      expect(progress.percentage).toBe(100);
    });

    it('deve retornar 0% quando não houver tarefas', () => {
      phase.tasks = [];
      const progress = service.calculatePhaseProgress(phase);
      expect(progress.completed).toBe(0);
      expect(progress.total).toBe(0);
      expect(progress.percentage).toBe(0);
    });

    it('deve calcular corretamente quando todas as tarefas são subtarefas', () => {
      phase.tasks = [
        {
          id: '1',
          name: 'Tarefa 1',
          executed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          subtasks: [
            { 
              id: '1.1', 
              name: 'Subtarefa 1.1', 
              executed: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            { 
              id: '1.2', 
              name: 'Subtarefa 1.2', 
              executed: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        }
      ];

      const progress = service.calculatePhaseProgress(phase);
      expect(progress.completed).toBe(2);
      expect(progress.total).toBe(3);
      expect(progress.percentage).toBe(66.66666666666666);
    });
  });
});
