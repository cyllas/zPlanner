import { StatusAnalyzer } from '../../../services/progress/StatusAnalyzer';
import { PhaseService } from '../../../services/PhaseService';
import { IPhase } from '../../../interfaces/IPhase';

describe('StatusAnalyzer', () => {
  let analyzer: StatusAnalyzer;
  let phaseService: PhaseService;

  beforeEach(() => {
    phaseService = new PhaseService();
    analyzer = new StatusAnalyzer(phaseService);
  });

  describe('getPhaseStatus', () => {
    it('deve retornar status "não iniciada" para fase sem tarefas', () => {
      const phase: IPhase = {
        name: 'Fase Teste',
        executed: false,
        tasks: []
      };

      const status = analyzer.getPhaseStatus(phase);

      expect(status.progress).toBe(0);
      expect(status.status).toBe('não iniciada');
      expect(status.taskStats.pendentes).toBe(0);
      expect(status.taskStats.emAndamento).toBe(0);
      expect(status.taskStats.concluidas).toBe(0);
    });

    it('deve retornar status "em andamento" para fase parcialmente completa', () => {
      const phase: IPhase = {
        name: 'Fase Teste',
        executed: false,
        tasks: [
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
        ]
      };

      const status = analyzer.getPhaseStatus(phase);

      expect(status.progress).toBe(50);
      expect(status.status).toBe('em andamento');
      expect(status.taskStats.pendentes).toBe(1);
      expect(status.taskStats.emAndamento).toBe(0);
      expect(status.taskStats.concluidas).toBe(1);
    });

    it('deve retornar status "concluída" para fase totalmente completa', () => {
      const phase: IPhase = {
        name: 'Fase Teste',
        executed: false,
        tasks: [
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
            executed: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      };

      const status = analyzer.getPhaseStatus(phase);

      expect(status.progress).toBe(100);
      expect(status.status).toBe('concluída');
      expect(status.taskStats.pendentes).toBe(0);
      expect(status.taskStats.emAndamento).toBe(0);
      expect(status.taskStats.concluidas).toBe(2);
    });
  });
});
