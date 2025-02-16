import { IProject } from '../interfaces/IProject';
import { ITask } from '../interfaces/ITask';
import { IPhase } from '../interfaces/IPhase';
import { StyleTemplate } from './StyleTemplate';

export class HTMLTemplate {
  private styleTemplate: StyleTemplate;

  constructor() {
    this.styleTemplate = new StyleTemplate();
  }

  public generateHTML(project: IProject): string {
    const styles = this.styleTemplate.generateStyles();
    const html = `
      <!DOCTYPE html>
      <html lang='pt-BR'>
        <head>
          <meta charset='UTF-8'>
          <meta name='viewport' content='width=device-width, initial-scale=1.0'>
          <title>${this.escapeHtml(project.project)}</title>
          <style>${styles}</style>
        </head>
        <body>
          <div class='projeto'>
            <h1 class='projeto__titulo'>${this.escapeHtml(project.project)}</h1>
            <p class='projeto__atualizacao'>Última Atualização: ${project.last_update}</p>
            <div class='projeto__fases'>
              ${this.generatePhases(project)}
            </div>
          </div>
        </body>
      </html>
    `;
    return html;
  }

  private generatePhases(project: IProject): string {
    return Object.entries(project.phases)
      .map(([id, phase]) => {
        const progress = this.calculatePhaseProgress(phase);
        return `
          <div class='fase${phase.executed ? ' fase--concluida' : ''}' id='${id}'>
            <h2 class='fase__titulo'>${this.escapeHtml(phase.name)}</h2>
            <div class='fase__progresso'>
              <div class='fase__barra' style='width: ${progress}%'></div>
              <span class='fase__porcentagem'>${progress}%</span>
            </div>
            <div class='fase__tarefas'>
              ${this.generateTasks(phase.tasks)}
            </div>
          </div>
        `;
      })
      .join('');
  }

  private generateTasks(tasks: ITask[]): string {
    return tasks
      .map(task => {
        const subtasksHtml = task.subtasks
          ? `<div class='tarefa__subtarefas'>
              ${this.generateSubtasks(task.subtasks)}
            </div>`
          : '';

        return `
          <div class='tarefa${task.executed ? ' tarefa--concluida' : ''}' id='${task.id}'>
            <span class='tarefa__nome'>${this.escapeHtml(task.name)}</span>
            ${subtasksHtml}
          </div>
        `;
      })
      .join('');
  }

  private generateSubtasks(subtasks: ITask[]): string {
    return subtasks
      .map(subtask => {
        const nestedSubtasks = subtask.subtasks
          ? `<div class='subtarefa__subtarefas'>
              ${this.generateSubtasks(subtask.subtasks)}
            </div>`
          : '';

        return `
          <div class='subtarefa${subtask.executed ? ' subtarefa--concluida' : ''}' id='${subtask.id}'>
            <span class='subtarefa__nome'>${this.escapeHtml(subtask.name)}</span>
            ${nestedSubtasks}
          </div>
        `;
      })
      .join('');
  }

  private calculatePhaseProgress(phase: IPhase): number {
    if (!phase.tasks.length) return 0;

    const countTasks = (tasks: ITask[]): { total: number; completed: number } => {
      return tasks.reduce(
        (acc, task) => {
          acc.total++;
          if (task.executed) acc.completed++;

          if (task.subtasks) {
            const subtaskCount = countTasks(task.subtasks);
            acc.total += subtaskCount.total;
            acc.completed += subtaskCount.completed;
          }

          return acc;
        },
        { total: 0, completed: 0 }
      );
    };

    const counts = countTasks(phase.tasks);
    return (counts.completed / counts.total) * 100;
  }

  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#039;',
      '"': '&quot;'
    };
    return text.replace(/[&<>'"]/g, m => map[m]);
  }
}
