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
        project: 'Projeto Teste',
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

    test('deve criar um novo arquivo se o conteúdo for undefined', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('undefined');
      
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
      
      new ProjectPlanner(testFile);
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

    test('deve remover uma tarefa e suas subtarefas', () => {
      planner.addTask('fase_1', '1.1', 'Tarefa Principal');
      planner.addSubtask('fase_1', '1.1', '1.1.1', 'Subtarefa');
      
      planner.removeTask('fase_1', '1.1');
      const tasks = planner.listTasksWithSubtasks();
      
      expect(tasks[0].phase.tasks).toHaveLength(0);
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

  describe('Remoção de Tarefas', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-02-15'));
      planner.addPhase('fase_1', 'Primeira Fase');
      planner.addTask('fase_1', '1.1', 'Tarefa Principal');
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('deve remover uma tarefa e atualizar o projeto', () => {
      planner.removeTask('fase_1', '1.1');
      const tasks = planner.listTasks();
      
      expect(tasks[0].phase.tasks).toHaveLength(0);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    test('deve lançar erro ao tentar remover tarefa em fase inexistente', () => {
      expect(() => {
        planner.removeTask('fase_inexistente', '1.1');
      }).toThrow('Fase "fase_inexistente" não encontrada');
    });

    test('deve lançar erro ao tentar remover tarefa inexistente', () => {
      expect(() => {
        planner.removeTask('fase_1', 'tarefa_inexistente');
      }).toThrow('Tarefa "tarefa_inexistente" não encontrada na fase "fase_1"');
    });

    test('deve remover tarefa e suas subtarefas', () => {
      planner.addSubtask('fase_1', '1.1', '1.1.1', 'Subtarefa 1');
      planner.addSubtask('fase_1', '1.1.1', '1.1.1.1', 'Subtarefa 2');
      
      planner.removeTask('fase_1', '1.1');
      const tasks = planner.listTasksWithSubtasks();
      
      expect(tasks[0].phase.tasks).toHaveLength(0);
    });

    test('deve atualizar a data do projeto ao remover uma tarefa', () => {
      const dataAntes = planner.getLastUpdate();
      jest.setSystemTime(new Date('2025-02-16'));
      planner.removeTask('fase_1', '1.1');
      expect(planner.getLastUpdate()).not.toBe(dataAntes);
    });
  });

  describe('Gerenciamento de Subtarefas', () => {
    beforeEach(() => {
      planner.addPhase('fase_1', 'Primeira Fase');
      planner.addTask('fase_1', '1.1', 'Tarefa Principal');
    });

    test('deve adicionar uma subtarefa', () => {
      planner.addSubtask('fase_1', '1.1', '1.1.1', 'Primeira Subtarefa');
      const tasks = planner.listTasksWithSubtasks();
      
      expect(tasks[0].phase.tasks[0].subtasks).toHaveLength(1);
      expect(tasks[0].phase.tasks[0].subtasks![0].name).toBe('Primeira Subtarefa');
      expect(tasks[0].phase.tasks[0].subtasks![0].executed).toBe(false);
      expect(tasks[0].phase.tasks[0].subtasks![0].parentId).toBe('1.1');
    });

    test('não deve permitir adicionar subtarefa com ID duplicado', () => {
      planner.addSubtask('fase_1', '1.1', '1.1.1', 'Primeira Subtarefa');
      
      expect(() => {
        planner.addSubtask('fase_1', '1.1', '1.1.1', 'Subtarefa Duplicada');
      }).toThrow('Já existe uma tarefa com o ID 1.1.1');
    });

    test('deve lançar erro ao adicionar subtarefa em tarefa inexistente', () => {
      expect(() => {
        planner.addSubtask('fase_1', 'tarefa_inexistente', '1.1.1', 'Subtarefa');
      }).toThrow('Tarefa pai tarefa_inexistente não encontrada na fase fase_1');
    });

    test('deve marcar uma subtarefa como concluída', () => {
      planner.addSubtask('fase_1', '1.1', '1.1.1', 'Primeira Subtarefa');
      planner.completeSubtask('fase_1', '1.1.1');
      const tasks = planner.listTasksWithSubtasks();
      
      expect(tasks[0].phase.tasks[0].subtasks![0].executed).toBe(true);
    });

    test('deve marcar tarefa pai como concluída quando todas as subtarefas estiverem concluídas', () => {
      planner.addSubtask('fase_1', '1.1', '1.1.1', 'Primeira Subtarefa');
      planner.addSubtask('fase_1', '1.1', '1.1.2', 'Segunda Subtarefa');
      
      planner.completeSubtask('fase_1', '1.1.1');
      planner.completeSubtask('fase_1', '1.1.2');
      
      const tasks = planner.listTasksWithSubtasks();
      expect(tasks[0].phase.tasks[0].executed).toBe(true);
    });

    test('não deve marcar tarefa pai como concluída se houver subtarefas pendentes', () => {
      planner.addSubtask('fase_1', '1.1', '1.1.1', 'Primeira Subtarefa');
      planner.addSubtask('fase_1', '1.1', '1.1.2', 'Segunda Subtarefa');
      
      planner.completeSubtask('fase_1', '1.1.1');
      
      const tasks = planner.listTasksWithSubtasks();
      expect(tasks[0].phase.tasks[0].executed).toBe(false);
    });

    test('deve lançar erro ao completar subtarefa inexistente', () => {
      expect(() => {
        planner.completeSubtask('fase_1', 'subtarefa_inexistente');
      }).toThrow('Tarefa subtarefa_inexistente não encontrada na fase fase_1');
    });
  });

  describe('Geração de HTML', () => {
    beforeEach(() => {
      planner.addPhase('fase_1', 'Primeira Fase');
      planner.addTask('fase_1', '1.1', 'Tarefa Principal');
      planner.addSubtask('fase_1', '1.1', '1.1.1', 'Primeira Subtarefa');
    });

    test('deve gerar HTML com estrutura básica', () => {
      const html = planner.generateHTML();
      
      expect(html).toContain('<html');
      expect(html).toContain('</html>');
      expect(html).toContain('<body');
      expect(html).toContain('</body>');
      expect(html).toContain('<style>');
      expect(html).toContain('</style>');
    });

    test('deve incluir informações do projeto no HTML', () => {
      const html = planner.generateHTML();
      
      expect(html).toContain('Primeira Fase');
      expect(html).toContain('Tarefa Principal');
      expect(html).toContain('Primeira Subtarefa');
    });

    test('deve incluir estilos CSS no HTML', () => {
      const html = planner.generateHTML();
      
      expect(html).toContain(':root');
      expect(html).toContain('--azul-profundo: #1E2A38');
      expect(html).toContain('--cinza-grafite: #3B3F45');
      expect(html).toContain('--dourado: #CBA36A');
      expect(html).toContain('.phase');
      expect(html).toContain('.task-item');
      expect(html).toContain('.subtask-list');
    });

    test('deve gerar HTML com diferentes níveis de indentação para subtarefas', () => {
      planner.addSubtask('fase_1', '1.1.1', '1.1.1.1', 'Subtarefa Nível 2');
      const html = planner.generateHTML();
      
      expect(html).toContain('margin-left: 30px');
      expect(html).toMatch(/Primeira Subtarefa.*Subtarefa Nível 2/s);
    });

    test('deve incluir datas de criação e atualização no HTML', () => {
      const html = planner.generateHTML();
      
      expect(html).toContain('Criado em:');
      expect(html).toContain('Última atualização:');
    });

    test('deve incluir status de conclusão no HTML', () => {
      planner.addTask('fase_1', '1.2', 'Segunda Tarefa');
      planner.completeTask('fase_1', '1.2');
      const html = planner.generateHTML();
      
      expect(html).toContain('✅');
      expect(html).toContain('⭕');
    });

    test('deve gerar HTML com múltiplos níveis de subtarefas', () => {
      planner.addSubtask('fase_1', '1.1.1', '1.1.1.1', 'Subtarefa Nível 2');
      planner.addSubtask('fase_1', '1.1.1.1', '1.1.1.1.1', 'Subtarefa Nível 3');
      const html = planner.generateHTML();
      
      expect(html).toMatch(/Primeira Subtarefa.*Subtarefa Nível 2.*Subtarefa Nível 3/s);
      expect(html).toContain('subtask-list');
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
