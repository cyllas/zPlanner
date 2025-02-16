import { TaskService } from '../../services/TaskService';
import { IPhase } from '../../interfaces/IPhase';
import { ITask } from '../../interfaces/ITask';
import { IProject } from '../../interfaces/IProject';

describe('TaskService', () => {
  let service: TaskService;
  const now = new Date().toISOString();

  beforeEach(() => {
    service = new TaskService();
  });

  describe('createTask', () => {
    it('deve criar uma nova tarefa com valores padrão', () => {
      const task = service.createTask('1', 'Tarefa Teste');

      expect(task.id).toBe('1');
      expect(task.name).toBe('Tarefa Teste');
      expect(task.executed).toBe(false);
      expect(task.created_at).toBeDefined();
      expect(task.updated_at).toBeDefined();
    });

    it('deve criar uma nova tarefa com parentId', () => {
      const task = service.createTask('1', 'Tarefa Teste', 'parent-1');

      expect(task.id).toBe('1');
      expect(task.name).toBe('Tarefa Teste');
      expect(task.parentId).toBe('parent-1');
    });
  });

  describe('addTask', () => {
    it('deve adicionar tarefa à fase', () => {
      const phase: IPhase = {
        name: 'Fase Teste',
        executed: false,
        tasks: []
      };

      service.addTask(phase, '1', 'Nova Tarefa');

      expect(phase.tasks).toHaveLength(1);
      expect(phase.tasks[0].id).toBe('1');
      expect(phase.tasks[0].name).toBe('Nova Tarefa');
    });
  });

  describe('moveTask', () => {
    it('deve mover tarefa para nova posição na mesma fase', () => {
      const phase: IPhase = {
        name: 'Fase Teste',
        executed: false,
        tasks: [
          { id: '1', name: 'Tarefa 1', executed: false, created_at: now, updated_at: now },
          { id: '2', name: 'Tarefa 2', executed: false, created_at: now, updated_at: now },
          { id: '3', name: 'Tarefa 3', executed: false, created_at: now, updated_at: now }
        ]
      };

      const result = service.moveTask(phase, '1', 2);

      expect(result).toBe(true);
      expect(phase.tasks[2].id).toBe('1');
      expect(phase.tasks.map(t => t.id)).toEqual(['2', '3', '1']);
    });

    it('deve retornar false para índice inválido', () => {
      const phase: IPhase = {
        name: 'Fase Teste',
        executed: false,
        tasks: [
          { id: '1', name: 'Tarefa 1', executed: false, created_at: now, updated_at: now }
        ]
      };

      const result = service.moveTask(phase, '1', 5);

      expect(result).toBe(false);
      expect(phase.tasks[0].id).toBe('1');
    });

    it('deve retornar false para tarefa inexistente', () => {
      const phase: IPhase = {
        name: 'Fase Teste',
        executed: false,
        tasks: [
          { id: '1', name: 'Tarefa 1', executed: false, created_at: now, updated_at: now }
        ]
      };

      const result = service.moveTask(phase, '2', 0);

      expect(result).toBe(false);
      expect(phase.tasks[0].id).toBe('1');
    });
  });

  describe('moveTaskBetweenPhases', () => {
    it('deve mover tarefa entre fases diferentes', () => {
      const sourcePhase: IPhase = {
        name: 'Fase Origem',
        executed: false,
        tasks: [
          { id: '1', name: 'Tarefa 1', executed: false, created_at: now, updated_at: now },
          { id: '2', name: 'Tarefa 2', executed: false, created_at: now, updated_at: now }
        ]
      };

      const targetPhase: IPhase = {
        name: 'Fase Destino',
        executed: false,
        tasks: [
          { id: '3', name: 'Tarefa 3', executed: false, created_at: now, updated_at: now }
        ]
      };

      const result = service.moveTaskBetweenPhases(sourcePhase, targetPhase, '1', 0);

      expect(result).toBe(true);
      expect(sourcePhase.tasks).toHaveLength(1);
      expect(targetPhase.tasks).toHaveLength(2);
      expect(targetPhase.tasks[0].id).toBe('1');
    });

    it('deve retornar false para índice inválido', () => {
      const sourcePhase: IPhase = {
        name: 'Fase Origem',
        executed: false,
        tasks: [
          { id: '1', name: 'Tarefa 1', executed: false, created_at: now, updated_at: now }
        ]
      };

      const targetPhase: IPhase = {
        name: 'Fase Destino',
        executed: false,
        tasks: []
      };

      const result = service.moveTaskBetweenPhases(sourcePhase, targetPhase, '1', 5);

      expect(result).toBe(false);
      expect(sourcePhase.tasks).toHaveLength(1);
      expect(targetPhase.tasks).toHaveLength(0);
    });

    it('deve retornar false para tarefa inexistente', () => {
      const sourcePhase: IPhase = {
        name: 'Fase Origem',
        executed: false,
        tasks: [
          { id: '1', name: 'Tarefa 1', executed: false, created_at: now, updated_at: now }
        ]
      };

      const targetPhase: IPhase = {
        name: 'Fase Destino',
        executed: false,
        tasks: []
      };

      const result = service.moveTaskBetweenPhases(sourcePhase, targetPhase, '2', 0);

      expect(result).toBe(false);
      expect(sourcePhase.tasks).toHaveLength(1);
      expect(targetPhase.tasks).toHaveLength(0);
    });
  });

  describe('updateTaskStatus', () => {
    it('deve alterar o status de uma tarefa', () => {
      const task: ITask = {
        id: '1',
        name: 'Tarefa Teste',
        executed: false,
        created_at: now,
        updated_at: now
      };

      service.updateTaskStatus(task, true);

      expect(task.executed).toBe(true);
      expect(task.updated_at).not.toBe(now);
    });
  });

  describe('renameTask', () => {
    it('deve renomear uma tarefa', () => {
      const task: ITask = {
        id: '1',
        name: 'Nome Antigo',
        executed: false,
        created_at: now,
        updated_at: now
      };

      service.renameTask(task, 'Novo Nome');

      expect(task.name).toBe('Novo Nome');
      expect(task.updated_at).not.toBe(now);
    });
  });

  describe('findTask', () => {
    it('deve encontrar uma tarefa em um projeto', () => {
      const project: IProject = {
        project: 'Projeto Teste',
        last_update: now,
        phases: {
          'fase1': {
            name: 'Fase 1',
            executed: false,
            tasks: [
              { id: '1', name: 'Tarefa 1', executed: false, created_at: now, updated_at: now }
            ]
          }
        }
      };

      const result = service.findTask(project, 'fase1', '1');

      expect(result.task).toBeDefined();
      expect(result.task?.id).toBe('1');
      expect(result.phase).toBeDefined();
      expect(result.phase?.name).toBe('Fase 1');
    });

    it('deve retornar null para fase inexistente', () => {
      const project: IProject = {
        project: 'Projeto Teste',
        last_update: now,
        phases: {}
      };

      const result = service.findTask(project, 'fase1', '1');

      expect(result.task).toBeNull();
      expect(result.phase).toBeNull();
    });

    it('deve retornar null para tarefa inexistente', () => {
      const project: IProject = {
        project: 'Projeto Teste',
        last_update: now,
        phases: {
          'fase1': {
            name: 'Fase 1',
            executed: false,
            tasks: []
          }
        }
      };

      const result = service.findTask(project, 'fase1', '1');

      expect(result.task).toBeNull();
      expect(result.phase).not.toBeNull();
    });

    it('deve encontrar uma subtarefa', () => {
      const project: IProject = {
        project: 'Projeto Teste',
        last_update: now,
        phases: {
          'fase1': {
            name: 'Fase 1',
            executed: false,
            tasks: [
              { 
                id: '1', 
                name: 'Tarefa 1', 
                executed: false, 
                created_at: now, 
                updated_at: now,
                subtasks: [
                  { id: '1.1', name: 'Subtarefa 1', executed: false, created_at: now, updated_at: now }
                ]
              }
            ]
          }
        }
      };

      const result = service.findTask(project, 'fase1', '1.1');

      expect(result.task).toBeDefined();
      expect(result.task?.id).toBe('1.1');
      expect(result.phase).toBeDefined();
      expect(result.phase?.name).toBe('Fase 1');
    });
  });

  describe('findTaskById', () => {
    it('deve encontrar uma tarefa pelo ID', () => {
      const phase: IPhase = {
        name: 'Fase Teste',
        executed: false,
        tasks: [
          { id: '1', name: 'Tarefa 1', executed: false, created_at: now, updated_at: now },
          { id: '2', name: 'Tarefa 2', executed: false, created_at: now, updated_at: now }
        ]
      };

      const task = service.findTaskById(phase, '2');

      expect(task).toBeDefined();
      expect(task?.id).toBe('2');
    });

    it('deve retornar undefined para ID inexistente', () => {
      const phase: IPhase = {
        name: 'Fase Teste',
        executed: false,
        tasks: []
      };

      const task = service.findTaskById(phase, '1');

      expect(task).toBeUndefined();
    });
  });
});
