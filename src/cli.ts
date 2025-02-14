#!/usr/bin/env node
import { ProjectPlanner } from './ProjectPlanner';
import { program } from 'commander';
import chalk from 'chalk';

const planner = new ProjectPlanner(process.cwd() + '/planner.json');

program
  .name('zplanner')
  .description('CLI para gerenciar planejamento de projetos')
  .version('1.0.0');

program
  .command('list')
  .description('Lista todas as tarefas e seus status')
  .action(() => {
    const tasks = planner.listTasks();
    
    console.log('\n📋 Status atual das tarefas:\n');
    
    tasks.forEach(({ phaseId, phase }) => {
      console.log(`${phase.name}:`);
      phase.tasks.forEach(task => {
        const status = task.executed ? chalk.green('✅') : chalk.gray('⭕');
        console.log(`${status} ${task.id}: ${task.name}`);
      });
      console.log('');
    });
  });

program
  .command('complete')
  .description('Marca uma tarefa como concluída')
  .argument('<phaseId>', 'ID da fase')
  .argument('<taskId>', 'ID da tarefa')
  .action((phaseId, taskId) => {
    try {
      planner.completeTask(phaseId, taskId);
      console.log(chalk.green('✅ Planner atualizado com sucesso!'));
      console.log(chalk.green(`✅ Tarefa ${taskId} marcada como concluída!`));
    } catch (err) {
      const error = err as Error;
      console.error(chalk.red(`❌ ${error.message}`));
    }
  });

program
  .command('pending')
  .description('Marca uma tarefa como pendente')
  .argument('<phaseId>', 'ID da fase')
  .argument('<taskId>', 'ID da tarefa')
  .action((phaseId, taskId) => {
    try {
      planner.pendingTask(phaseId, taskId);
      console.log(chalk.yellow('⚠️  Planner atualizado com sucesso!'));
      console.log(chalk.yellow(`⚠️  Tarefa ${taskId} marcada como pendente!`));
    } catch (err) {
      const error = err as Error;
      console.error(chalk.red(`❌ ${error.message}`));
    }
  });

program
  .command('progress')
  .description('Mostra o progresso geral do projeto')
  .action(() => {
    const progress = planner.getProgress();
    
    console.log('\n📊 Progresso do Projeto:\n');
    console.log(`Tarefas: ${progress.tasks}%`);
    console.log(`Fases: ${progress.phases}%`);
  });

program
  .command('add-phase')
  .description('Adiciona uma nova fase')
  .argument('<phaseId>', 'ID da fase')
  .argument('<name>', 'Nome da fase')
  .action((phaseId, name) => {
    try {
      planner.addPhase(phaseId, name);
      console.log(chalk.green(`✅ Fase "${name}" adicionada com sucesso!`));
    } catch (err) {
      const error = err as Error;
      console.error(chalk.red(`❌ ${error.message}`));
    }
  });

program
  .command('add-task')
  .description('Adiciona uma nova tarefa')
  .argument('<phaseId>', 'ID da fase')
  .argument('<taskId>', 'ID da tarefa')
  .argument('<name>', 'Nome da tarefa')
  .action((phaseId, taskId, name) => {
    try {
      planner.addTask(phaseId, taskId, name);
      console.log(chalk.green(`✅ Tarefa "${name}" adicionada com sucesso!`));
    } catch (err) {
      const error = err as Error;
      console.error(chalk.red(`❌ ${error.message}`));
    }
  });

program.parse();
