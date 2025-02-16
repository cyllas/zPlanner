import { ProgressReporter } from '../../../services/progress/ProgressReporter';
import { ProgressCalculator } from '../../../services/progress/ProgressCalculator';
import { StatusAnalyzer } from '../../../services/progress/StatusAnalyzer';
import { PhaseService } from '../../../services/PhaseService';
import { IProject } from '../../../interfaces/IProject';

jest.mock('../../../services/progress/ProgressCalculator');
jest.mock('../../../services/progress/StatusAnalyzer');

describe('ProgressReporter', () => {
  let reporter: ProgressReporter;
  let calculator: jest.Mocked<ProgressCalculator>;
  let analyzer: jest.Mocked<StatusAnalyzer>;
  let phaseService: PhaseService;

  beforeEach(() => {
    phaseService = new PhaseService();
    calculator = new ProgressCalculator(phaseService) as jest.Mocked<ProgressCalculator>;
    analyzer = new StatusAnalyzer(phaseService) as jest.Mocked<StatusAnalyzer>;
    reporter = new ProgressReporter(calculator, analyzer);
  });

  describe('getDetailedProgress', () => {
    it('deve gerar relatório detalhado corretamente', () => {
      const project: IProject = {
        project: 'Projeto Teste',
        last_update: new Date().toLocaleDateString('pt-BR'),
        phases: {
          'fase1': {
            name: 'Fase 1',
            executed: false,
            tasks: []
          }
        }
      };

      calculator.calculateProjectProgress.mockReturnValue({
        tasks: { completed: 1, total: 2, percentage: 50 },
        phases: { completed: 0, total: 1, percentage: 0 }
      });

      analyzer.getPhaseStatus.mockReturnValue({
        progress: 50,
        status: 'em andamento',
        taskStats: {
          pendentes: 1,
          emAndamento: 0,
          concluidas: 1
        }
      });

      const report = reporter.getDetailedProgress(project);

      expect(report.geral.tasks).toBe(50);
      expect(report.geral.phases).toBe(0);
      expect(report.fases.fase1).toBeDefined();
      expect(report.fases.fase1.nome).toBe('Fase 1');
      expect(report.fases.fase1.progresso).toBe(50);
      expect(report.fases.fase1.status).toBe('em andamento');
      expect(report.fases.fase1.tarefas.pendentes).toBe(1);
      expect(report.fases.fase1.tarefas.concluidas).toBe(1);
    });
  });

  describe('getBasicProgress', () => {
    it('deve retornar progresso básico corretamente', () => {
      const project: IProject = {
        project: 'Projeto Teste',
        last_update: new Date().toLocaleDateString('pt-BR'),
        phases: {}
      };

      calculator.calculateProjectProgress.mockReturnValue({
        tasks: { completed: 3, total: 4, percentage: 75 },
        phases: { completed: 1, total: 2, percentage: 50 }
      });

      const progress = reporter.getBasicProgress(project);

      expect(progress.tasks).toBe(75);
      expect(progress.phases).toBe(50);
      expect(calculator.calculateProjectProgress).toHaveBeenCalledWith(project);
    });
  });
});
