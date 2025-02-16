import { ProgressCalculator } from '../../../services/progress/ProgressCalculator';
import { PhaseService } from '../../../services/PhaseService';
import { IPhase } from '../../../interfaces/IPhase';
import { IProject } from '../../../interfaces/IProject';

describe('ProgressCalculator', () => {
  let calculator: ProgressCalculator;
  let phaseService: PhaseService;
  const now = new Date().toISOString();

  beforeEach(() => {
    phaseService = new PhaseService();
    calculator = new ProgressCalculator(phaseService);
  });

  describe('calculateProjectProgress', () => {
    it('deve calcular corretamente o progresso quando não há fases', () => {
      const project: IProject = {
        project: 'Projeto Teste',
        last_update: new Date().toLocaleDateString('pt-BR'),
        phases: {}
      };

      const progress = calculator.calculateProjectProgress(project);

      expect(progress.tasks.completed).toBe(0);
      expect(progress.tasks.total).toBe(0);
      expect(progress.tasks.percentage).toBe(0);
      expect(progress.phases.completed).toBe(0);
      expect(progress.phases.total).toBe(0);
      expect(progress.phases.percentage).toBe(0);
    });

    it('deve calcular corretamente o progresso com fases e tarefas', () => {
      const project: IProject = {
        project: 'Projeto Teste',
        last_update: new Date().toLocaleDateString('pt-BR'),
        phases: {
          'fase1': {
            name: 'Fase 1',
            executed: false,
            tasks: [
              { id: '1', name: 'Tarefa 1', executed: true, created_at: now, updated_at: now },
              { id: '2', name: 'Tarefa 2', executed: false, created_at: now, updated_at: now }
            ]
          },
          'fase2': {
            name: 'Fase 2',
            executed: false,
            tasks: [
              { id: '3', name: 'Tarefa 3', executed: true, created_at: now, updated_at: now }
            ]
          }
        }
      };

      const progress = calculator.calculateProjectProgress(project);

      expect(progress.tasks.completed).toBe(2);
      expect(progress.tasks.total).toBe(3);
      expect(progress.tasks.percentage).toBeCloseTo(66.67, 2);
      expect(progress.phases.completed).toBe(1);
      expect(progress.phases.total).toBe(2);
      expect(progress.phases.percentage).toBeCloseTo(50, 2);
    });
  });

  describe('calculatePhaseProgress', () => {
    it('deve calcular corretamente o progresso de uma fase vazia', () => {
      const phase: IPhase = {
        name: 'Fase Teste',
        executed: false,
        tasks: []
      };

      const progress = calculator.calculatePhaseProgress(phase);

      expect(progress.completed).toBe(0);
      expect(progress.total).toBe(0);
      expect(progress.percentage).toBe(0);
    });

    it('deve calcular corretamente o progresso de uma fase com tarefas', () => {
      const phase: IPhase = {
        name: 'Fase Teste',
        executed: false,
        tasks: [
          { id: '1', name: 'Tarefa 1', executed: true, created_at: now, updated_at: now },
          { id: '2', name: 'Tarefa 2', executed: true, created_at: now, updated_at: now },
          { id: '3', name: 'Tarefa 3', executed: false, created_at: now, updated_at: now }
        ]
      };

      const progress = calculator.calculatePhaseProgress(phase);

      expect(progress.completed).toBe(2);
      expect(progress.total).toBe(3);
      expect(progress.percentage).toBeCloseTo(66.67, 2);
    });
  });
});
