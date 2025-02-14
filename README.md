# zPlanner

Gerenciador de planejamento de projetos com fases e tarefas.

## Instalação

```bash
npm install zplanner
```

## Uso como Biblioteca

```typescript
import { ProjectPlanner } from 'zplanner';

// Inicializar o planner
const planner = new ProjectPlanner('./planner.json');

// Listar tarefas
const tasks = planner.listTasks();

// Marcar tarefa como concluída
planner.completeTask('fase_1', 'tarefa_1');

// Marcar tarefa como pendente
planner.pendingTask('fase_1', 'tarefa_1');

// Verificar progresso
const progress = planner.getProgress();
console.log(`Progresso: ${progress.tasks}% das tarefas`);

// Adicionar nova fase
planner.addPhase('fase_2', 'Nome da Fase');

// Adicionar nova tarefa
planner.addTask('fase_2', 'tarefa_1', 'Nome da Tarefa');
```

## Uso via CLI

```bash
# Instalar globalmente (opcional)
npm install -g zplanner

# Listar todas as tarefas
zplanner list

# Marcar tarefa como concluída
zplanner complete fase_1 tarefa_1

# Marcar tarefa como pendente
zplanner pending fase_1 tarefa_1

# Ver progresso do projeto
zplanner progress

# Adicionar nova fase
zplanner add-phase fase_2 "Nome da Fase"

# Adicionar nova tarefa
zplanner add-task fase_2 tarefa_1 "Nome da Tarefa"

# Ou usar com npx
npx zplanner list
```

## Estrutura do planner.json

```json
{
  "project": "Nome do Projeto",
  "last_update": "13/02/2025",
  "phases": {
    "fase_1": {
      "name": "Nome da Fase",
      "executed": false,
      "tasks": [
        {
          "id": "1.1",
          "name": "Nome da Tarefa",
          "executed": false
        }
      ]
    }
  }
}
```

## API

### ProjectPlanner

#### `constructor(projectPath: string)`
Inicializa o planner com o caminho do arquivo planner.json

#### `getProgress(): { tasks: number; phases: number }`
Retorna o progresso do projeto em porcentagem

#### `listTasks(): { phaseId: string; phase: Phase }[]`
Lista todas as fases e tarefas do projeto

#### `completeTask(phaseId: string, taskId: string): void`
Marca uma tarefa como concluída

#### `pendingTask(phaseId: string, taskId: string): void`
Marca uma tarefa como pendente

#### `addPhase(phaseId: string, name: string): void`
Adiciona uma nova fase ao projeto

#### `addTask(phaseId: string, taskId: string, name: string): void`
Adiciona uma nova tarefa a uma fase

#### `removePhase(phaseId: string): void`
Remove uma fase do projeto

#### `removeTask(phaseId: string, taskId: string): void`
Remove uma tarefa de uma fase

## Licença

MIT
