#!/usr/bin/env node
import { Command } from 'commander';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { version } from '../package.json';
import {
  ProjectService,
  FileProjectRepository,
  HTMLExportService,
  HTMLTemplate,
  StyleTemplate,
  TaskService,
  PhaseService
} from './index';
import { ProgressService } from './services/ProgressService';
import { ITask } from './interfaces/ITask';

const program = new Command();
const repository = new FileProjectRepository(join(process.cwd(), 'planner.json'));
const taskService = new TaskService();
const phaseService = new PhaseService();
const progressService = new ProgressService(taskService, phaseService);
const projectService = new ProjectService(repository, taskService, phaseService, progressService);
const htmlTemplate = new HTMLTemplate();
const htmlExporter = new HTMLExportService(htmlTemplate);

program
  .name('zplanner')
  .description('CLI para gerenciar projetos')
  .version(version);

// Comandos de Fase
program
  .command('add-phase')
  .description('Adiciona uma nova fase ao projeto')
  .argument('<id>', 'ID da fase')
  .argument('<nome>', 'Nome da fase')
  .action((id: string, name: string) => {
    try {
      projectService.addPhase(id, name);
      console.log(`Fase "${name}" adicionada com sucesso!`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Erro: ${error.message}`);
      }
    }
  });

program
  .command('rename-phase')
  .description('Renomeia uma fase existente')
  .argument('<id>', 'ID da fase')
  .argument('<novo-nome>', 'Novo nome da fase')
  .action((id: string, newName: string) => {
    try {
      projectService.renamePhase(id, newName);
      console.log(`Fase renomeada para "${newName}" com sucesso!`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Erro: ${error.message}`);
      }
    }
  });

program
  .command('move-phase')
  .description('Move uma fase para uma nova posição')
  .argument('<id>', 'ID da fase')
  .argument('<posicao>', 'Nova posição (número)')
  .action((id: string, position: string) => {
    try {
      projectService.movePhase(id, parseInt(position, 10));
      console.log(`Fase "${id}" movida com sucesso!`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Erro: ${error.message}`);
      }
    }
  });

program
  .command('remove-phase')
  .description('Remove uma fase do projeto')
  .argument('<id>', 'ID da fase')
  .action((id: string) => {
    try {
      projectService.removePhase(id);
      console.log(`Fase "${id}" removida com sucesso!`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Erro: ${error.message}`);
      }
    }
  });

// Comandos de Tarefa
program
  .command('add-task')
  .description('Adiciona uma nova tarefa a uma fase')
  .argument('<phase>', 'ID da fase')
  .argument('<id>', 'ID da tarefa')
  .argument('<nome>', 'Nome da tarefa')
  .action((phase: string, id: string, name: string) => {
    try {
      projectService.addTask(phase, id, name);
      console.log(`Tarefa "${name}" adicionada com sucesso!`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Erro: ${error.message}`);
      }
    }
  });

program
  .command('add-subtask')
  .description('Adiciona uma subtarefa a uma tarefa existente')
  .argument('<phase>', 'ID da fase')
  .argument('<parent>', 'ID da tarefa pai')
  .argument('<id>', 'ID da subtarefa')
  .argument('<nome>', 'Nome da subtarefa')
  .action((phase: string, parent: string, id: string, name: string) => {
    try {
      projectService.addSubtask(phase, parent, id, name);
      console.log(`Subtarefa "${name}" adicionada com sucesso à tarefa ${parent}!`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Erro: ${error.message}`);
      }
    }
  });

program
  .command('move-task')
  .description('Move uma tarefa para outra fase')
  .argument('<fase-origem>', 'ID da fase de origem')
  .argument('<fase-destino>', 'ID da fase de destino')
  .argument('<id>', 'ID da tarefa')
  .action((sourcePhase: string, targetPhase: string, taskId: string) => {
    try {
      projectService.moveTask(sourcePhase, targetPhase, taskId);
      console.log(`Tarefa "${taskId}" movida com sucesso!`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Erro: ${error.message}`);
      }
    }
  });

// Comandos de Status
program
  .command('complete')
  .description('Marca uma tarefa como concluída')
  .argument('<fase>', 'ID da fase')
  .argument('<id>', 'ID da tarefa')
  .action((phase: string, id: string) => {
    try {
      projectService.completeTask(phase, id);
      console.log(`Tarefa "${id}" marcada como concluída!`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Erro: ${error.message}`);
      }
    }
  });

program
  .command('pending')
  .description('Marca uma tarefa como pendente')
  .argument('<fase>', 'ID da fase')
  .argument('<id>', 'ID da tarefa')
  .action((phase: string, id: string) => {
    try {
      projectService.pendingTask(phase, id);
      console.log(`Tarefa "${id}" marcada como pendente!`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Erro: ${error.message}`);
      }
    }
  });

// Comandos de Visualização
program
  .command('list')
  .description('Lista todas as fases, tarefas e subtarefas')
  .action(() => {
    const project = projectService.getProject();
    const phases = project.phases;
    
    Object.entries(phases).forEach(([_, phase]) => {
      console.log(`\n📦 ${phase.name}:`);
      if (phase.tasks.length === 0) {
        console.log('   Nenhuma tarefa');
      } else {
        const printTask = (task: ITask, level = 0): void => {
          const indent = '   '.repeat(level + 1);
          const status = task.executed ? '✅' : '⭕';
          console.log(`${indent}${status} ${task.id}: ${task.name}`);
          
          if (task.subtasks) {
            task.subtasks.forEach((subtask: ITask) => printTask(subtask, level + 1));
          }
        };

        phase.tasks.forEach((task: ITask) => printTask(task));
      }
    });
  });

program
  .command('progress')
  .description('Mostra o progresso detalhado do projeto')
  .option('-d, --detailed', 'Mostra progresso detalhado')
  .action((options: { detailed?: boolean }) => {
    if (options.detailed) {
      const progress = projectService.getDetailedProgress();
      console.log('\n📊 Progresso Detalhado do Projeto:');
      console.log(`\n🔄 Progresso Geral:`);
      console.log(`  - Tarefas: ${progress.geral.tasks.toFixed(1)}%`);
      console.log(`  - Fases: ${progress.geral.phases.toFixed(1)}%\n`);
      
      console.log('📑 Progresso por Fase:');
      Object.entries(progress.fases).forEach(([id, fase]) => {
        console.log(`\n  ${fase.nome} (${id}):`);
        console.log(`    Progresso: ${fase.progresso.toFixed(1)}%`);
        console.log(`    Status: ${fase.status}`);
        console.log(`    Tarefas:`);
        console.log(`      ⭕ Pendentes: ${fase.tarefas.pendentes}`);
        console.log(`      🔄 Em andamento: ${fase.tarefas.emAndamento}`);
        console.log(`      ✅ Concluídas: ${fase.tarefas.concluidas}`);
      });
    } else {
      const progress = projectService.getProgress();
      console.log('\n📊 Progresso do Projeto:');
      console.log(`- Tarefas: ${progress.tasks.toFixed(1)}%`);
      console.log(`- Fases: ${progress.phases.toFixed(1)}%`);
    }
  });

program
  .command('export-html')
  .description('Exporta o projeto para um arquivo HTML')
  .argument('[output]', 'Caminho do arquivo de saída', 'zplanner.html')
  .action((output: string) => {
    try {
      htmlExporter.exportToHTML(projectService.getProject(), output);
      console.log(`Projeto exportado com sucesso para ${output}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Erro ao exportar: ${error.message}`);
      }
    }
  });

program.parse();
