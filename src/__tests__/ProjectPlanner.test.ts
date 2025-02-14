import { ProjectPlanner } from '../ProjectPlanner';
import * as fs from 'fs';
import { join } from 'path';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
  existsSync: jest.fn(),
  chmodSync: jest.fn(),
  unlinkSync: jest.fn()
}));

describe('ProjectPlanner', () => {
  const testFile = join(__dirname, 'test-planner.json');
  let planner: ProjectPlanner;

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockImplementation(() => false);
    (fs.writeFileSync as jest.Mock).mockImplementation(() => undefined);
    (fs.readFileSync as jest.Mock).mockImplementation(() => '{}');
    planner = new ProjectPlanner(testFile);
  });

  describe('Inicialização', () => {
    test('deve criar um novo arquivo planner.json se não existir', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      new ProjectPlanner(testFile);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    test('deve carregar um arquivo existente', () => {
      const existingPlanner = {
        project: "Projeto Teste",
        last_update: new Date().toLocaleDateString('pt-BR'),
        phases: {}
      };
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(existingPlanner));
      
      const newPlanner = new ProjectPlanner(testFile);
      const progress = newPlanner.getProgress();
      
      expect(progress.tasks).toBe(0);
      expect(progress.phases).toBe(0);
    });

    test('deve criar um novo arquivo se o existente estiver corrompido', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('arquivo corrompido');
      
      const newPlanner = new ProjectPlanner(testFile);
      const progress = newPlanner.getProgress();
      
      expect(progress.tasks).toBe(0);
      expect(progress.phases).toBe(0);
    });

    test('deve criar um novo arquivo se o conteúdo for nulo', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('null');
      
      const newPlanner = new ProjectPlanner(testFile);
      const progress = newPlanner.getProgress();
      
      expect(progress.tasks).toBe(0);
      expect(progress.phases).toBe(0);
    });

    test('deve lançar erro ao tentar salvar em arquivo sem permissão', () => {
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('EACCES: permission denied');
      });
      
      expect(() => {
        planner.addPhase('fase_1', 'Primeira Fase');
      }).toThrow('Erro ao salvar projeto');
    });

    test('deve lançar erro ao tentar ler arquivo com erro de sistema', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });
      
      const newPlanner = new ProjectPlanner(testFile);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe('Gerenciamento de Fases', () => {
    test('deve adicionar uma nova fase', () => {
      planner.addPhase('fase_1', 'Primeira Fase');
      const tasks = planner.listTasks();
      
      expect(tasks).toHaveLength(1);
      expect(tasks[0].phase.name).toBe('Primeira Fase');
      expect(tasks[0].phase.executed).toBe(false);
    });

    test('não deve permitir adicionar fase duplicada', () => {
      planner.addPhase('fase_1', 'Primeira Fase');
      
      expect(() => {
        planner.addPhase('fase_1', 'Fase Duplicada');
      }).toThrow('Fase "fase_1" já existe');
    });

    test('deve remover uma fase existente', () => {
      planner.addPhase('fase_1', 'Primeira Fase');
      planner.removePhase('fase_1');
      const tasks = planner.listTasks();
      
      expect(tasks).toHaveLength(0);
    });

    test('deve lançar erro ao tentar remover fase inexistente', () => {
      expect(() => {
        planner.removePhase('fase_inexistente');
      }).toThrow('Fase "fase_inexistente" não encontrada');
    });

    test('deve lançar erro ao tentar remover fase em arquivo sem permissão', () => {
      planner.addPhase('fase_1', 'Primeira Fase');
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('EACCES: permission denied');
      });
      
      expect(() => {
        planner.removePhase('fase_1');
      }).toThrow('Erro ao salvar projeto');
    });
  });

  describe('Gerenciamento de Tarefas', () => {
    beforeEach(() => {
      planner.addPhase('fase_1', 'Primeira Fase');
    });

    test('deve adicionar uma nova tarefa', () => {
      planner.addTask('fase_1', '1.1', 'Primeira Tarefa');
      const tasks = planner.listTasks();
      
      expect(tasks[0].phase.tasks).toHaveLength(1);
      expect(tasks[0].phase.tasks[0].name).toBe('Primeira Tarefa');
      expect(tasks[0].phase.tasks[0].executed).toBe(false);
    });

    test('não deve permitir adicionar tarefa duplicada', () => {
      planner.addTask('fase_1', '1.1', 'Primeira Tarefa');
      
      expect(() => {
        planner.addTask('fase_1', '1.1', 'Tarefa Duplicada');
      }).toThrow('Tarefa "1.1" já existe na fase "fase_1"');
    });

    test('deve lançar erro ao adicionar tarefa em fase inexistente', () => {
      expect(() => {
        planner.addTask('fase_inexistente', '1.1', 'Primeira Tarefa');
      }).toThrow('Fase "fase_inexistente" não encontrada');
    });

    test('deve lançar erro ao adicionar tarefa em arquivo sem permissão', () => {
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('EACCES: permission denied');
      });
      
      expect(() => {
        planner.addTask('fase_1', '1.1', 'Primeira Tarefa');
      }).toThrow('Erro ao salvar projeto');
    });

    test('deve marcar uma tarefa como concluída', () => {
      planner.addTask('fase_1', '1.1', 'Primeira Tarefa');
      planner.completeTask('fase_1', '1.1');
      const tasks = planner.listTasks();
      
      expect(tasks[0].phase.tasks[0].executed).toBe(true);
    });

    test('deve lançar erro ao completar tarefa em fase inexistente', () => {
      expect(() => {
        planner.completeTask('fase_inexistente', '1.1');
      }).toThrow('Fase "fase_inexistente" não encontrada');
    });

    test('deve lançar erro ao completar tarefa inexistente', () => {
      expect(() => {
        planner.completeTask('fase_1', 'tarefa_inexistente');
      }).toThrow('Tarefa "tarefa_inexistente" não encontrada na fase "fase_1"');
    });

    test('deve lançar erro ao completar tarefa em arquivo sem permissão', () => {
      planner.addTask('fase_1', '1.1', 'Primeira Tarefa');
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('EACCES: permission denied');
      });
      
      expect(() => {
        planner.completeTask('fase_1', '1.1');
      }).toThrow('Erro ao salvar projeto');
    });

    test('deve marcar uma tarefa como pendente', () => {
      planner.addTask('fase_1', '1.1', 'Primeira Tarefa');
      planner.completeTask('fase_1', '1.1');
      planner.pendingTask('fase_1', '1.1');
      const tasks = planner.listTasks();
      
      expect(tasks[0].phase.tasks[0].executed).toBe(false);
    });

    test('deve lançar erro ao marcar como pendente tarefa em fase inexistente', () => {
      expect(() => {
        planner.pendingTask('fase_inexistente', '1.1');
      }).toThrow('Fase "fase_inexistente" não encontrada');
    });

    test('deve lançar erro ao marcar como pendente tarefa inexistente', () => {
      expect(() => {
        planner.pendingTask('fase_1', 'tarefa_inexistente');
      }).toThrow('Tarefa "tarefa_inexistente" não encontrada na fase "fase_1"');
    });

    test('deve lançar erro ao marcar como pendente tarefa em arquivo sem permissão', () => {
      planner.addTask('fase_1', '1.1', 'Primeira Tarefa');
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('EACCES: permission denied');
      });
      
      expect(() => {
        planner.pendingTask('fase_1', '1.1');
      }).toThrow('Erro ao salvar projeto');
    });

    test('deve remover uma tarefa existente', () => {
      planner.addTask('fase_1', '1.1', 'Primeira Tarefa');
      planner.removeTask('fase_1', '1.1');
      const tasks = planner.listTasks();
      
      expect(tasks[0].phase.tasks).toHaveLength(0);
    });

    test('deve lançar erro ao remover tarefa em fase inexistente', () => {
      expect(() => {
        planner.removeTask('fase_inexistente', '1.1');
      }).toThrow('Fase "fase_inexistente" não encontrada');
    });

    test('deve lançar erro ao remover tarefa inexistente', () => {
      expect(() => {
        planner.removeTask('fase_1', 'tarefa_inexistente');
      }).toThrow('Tarefa "tarefa_inexistente" não encontrada na fase "fase_1"');
    });

    test('deve lançar erro ao remover tarefa em arquivo sem permissão', () => {
      planner.addTask('fase_1', '1.1', 'Primeira Tarefa');
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('EACCES: permission denied');
      });
      
      expect(() => {
        planner.removeTask('fase_1', '1.1');
      }).toThrow('Erro ao salvar projeto');
    });
  });

  describe('Cálculo de Progresso', () => {
    beforeEach(() => {
      planner.addPhase('fase_1', 'Primeira Fase');
      planner.addPhase('fase_2', 'Segunda Fase');
      planner.addTask('fase_1', '1.1', 'Tarefa 1.1');
      planner.addTask('fase_1', '1.2', 'Tarefa 1.2');
      planner.addTask('fase_2', '2.1', 'Tarefa 2.1');
    });

    test('deve calcular o progresso corretamente', () => {
      planner.completeTask('fase_1', '1.1');
      planner.completeTask('fase_1', '1.2');
      const progress = planner.getProgress();
      
      expect(progress.tasks).toBe(66.7); // 2 de 3 tarefas
      expect(progress.phases).toBe(50); // 1 de 2 fases
    });

    test('deve retornar 0% quando não houver tarefas', () => {
      const emptyPlanner = new ProjectPlanner(join(__dirname, 'empty-planner.json'));
      const progress = emptyPlanner.getProgress();
      
      expect(progress.tasks).toBe(0);
      expect(progress.phases).toBe(0);
    });

    test('deve retornar 0% quando não houver fases', () => {
      const noPhases = new ProjectPlanner(join(__dirname, 'no-phases.json'));
      const progress = noPhases.getProgress();
      
      expect(progress.tasks).toBe(0);
      expect(progress.phases).toBe(0);
    });

    test('deve marcar fase como concluída quando todas as tarefas estiverem concluídas', () => {
      planner.completeTask('fase_1', '1.1');
      planner.completeTask('fase_1', '1.2');
      const tasks = planner.listTasks();
      
      expect(tasks[0].phase.executed).toBe(true);
    });
  });
});
