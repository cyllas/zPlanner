import { Command } from 'commander';
import { ProjectService } from '../../services/ProjectService';
import { ICommandHandler } from '../interfaces/ICommandHandler';
import { HelpMessages } from '../help/HelpMessages';

export class PhaseCommandHandler implements ICommandHandler {
  constructor(private projectService: ProjectService) {}

  public registerCommands(program: Command): void {
    this.registerAddPhase(program);
    this.registerRenamePhase(program);
    this.registerMovePhase(program);
    this.registerRemovePhase(program);
  }

  private registerAddPhase(program: Command): void {
    program
      .command('add-phase')
      .description('Adiciona uma nova fase ao projeto')
      .argument('<id>', 'ID da fase')
      .argument('<nome>', 'Nome da fase')
      .helpOption('-h, --help', 'Exibe ajuda do comando')
      .addHelpText('after', HelpMessages.PHASE.ADD)
      .action((id: string, name: string) => {
        try {
          this.projectService.addPhase(id, name);
          console.log(`Fase "${name}" adicionada com sucesso!`);
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Erro: ${error.message}`);
          }
        }
      });
  }

  private registerRenamePhase(program: Command): void {
    program
      .command('rename-phase')
      .description('Renomeia uma fase existente')
      .argument('<id>', 'ID da fase')
      .argument('<novo-nome>', 'Novo nome da fase')
      .helpOption('-h, --help', 'Exibe ajuda do comando')
      .addHelpText('after', HelpMessages.PHASE.RENAME)
      .action((id: string, newName: string) => {
        try {
          this.projectService.renamePhase(id, newName);
          console.log(`Fase renomeada para "${newName}" com sucesso!`);
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Erro: ${error.message}`);
          }
        }
      });
  }

  private registerMovePhase(program: Command): void {
    program
      .command('move-phase')
      .description('Move uma fase para uma nova posição')
      .argument('<id>', 'ID da fase')
      .argument('<posicao>', 'Nova posição (número)')
      .helpOption('-h, --help', 'Exibe ajuda do comando')
      .addHelpText('after', HelpMessages.PHASE.MOVE)
      .action((id: string, position: string) => {
        try {
          this.projectService.movePhase(id, parseInt(position, 10));
          console.log(`Fase "${id}" movida com sucesso!`);
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Erro: ${error.message}`);
          }
        }
      });
  }

  private registerRemovePhase(program: Command): void {
    program
      .command('remove-phase')
      .description('Remove uma fase do projeto')
      .argument('<id>', 'ID da fase')
      .helpOption('-h, --help', 'Exibe ajuda do comando')
      .addHelpText('after', HelpMessages.PHASE.REMOVE)
      .action((id: string) => {
        try {
          this.projectService.removePhase(id);
          console.log(`Fase "${id}" removida com sucesso!`);
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Erro: ${error.message}`);
          }
        }
      });
  }
}
