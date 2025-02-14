#!/usr/bin/env node
import { Command } from 'commander';
import { ProjectPlanner } from './ProjectPlanner';
import { join } from 'path';

const program = new Command();
const planner = new ProjectPlanner(join(process.cwd(), 'planner.json'));

program
  .name('zplanner')
  .description('CLI para gerenciar projetos')
  .version('1.0.1');

program
  .command('list')
  .description('Lista todas as fases e tarefas')
  .action(() => {
    const tasks = planner.listTasks();
    tasks.forEach(({ phase }) => {
      console.log(`\n📦 ${phase.name}:`);
      if (phase.tasks.length === 0) {
        console.log('   Nenhuma tarefa');
      } else {
        phase.tasks.forEach(task => {
          const status = task.executed ? '✅' : '⭕';
          console.log(`   ${status} ${task.name}`);
        });
      }
    });
  });

program
  .command('add-phase')
  .description('Adiciona uma nova fase ao projeto')
  .argument('<id>', 'ID da fase')
  .argument('<name>', 'Nome da fase')
  .action((id: string, name: string) => {
    planner.addPhase(id, name);
    console.log(`Fase "${name}" adicionada com sucesso!`);
  });

program
  .command('add-task')
  .description('Adiciona uma nova tarefa a uma fase')
  .argument('<phase>', 'ID da fase')
  .argument('<id>', 'ID da tarefa')
  .argument('<name>', 'Nome da tarefa')
  .action((phase: string, id: string, name: string) => {
    planner.addTask(phase, id, name);
    console.log(`Tarefa "${name}" adicionada com sucesso!`);
  });

program
  .command('complete-task')
  .description('Marca uma tarefa como concluída')
  .argument('<phase>', 'ID da fase')
  .argument('<id>', 'ID da tarefa')
  .action((phase: string, id: string) => {
    planner.completeTask(phase, id);
    console.log(`Tarefa "${id}" marcada como concluída!`);
  });

program
  .command('pending-task')
  .description('Marca uma tarefa como pendente')
  .argument('<phase>', 'ID da fase')
  .argument('<id>', 'ID da tarefa')
  .action((phase: string, id: string) => {
    planner.pendingTask(phase, id);
    console.log(`Tarefa "${id}" marcada como pendente!`);
  });

program
  .command('progress')
  .description('Mostra o progresso do projeto')
  .action(() => {
    const progress = planner.getProgress();
    console.log('Progresso do Projeto:');
    console.log(`- Tarefas: ${progress.tasks}%`);
    console.log(`- Fases: ${progress.phases}%`);
  });

program.parse();
