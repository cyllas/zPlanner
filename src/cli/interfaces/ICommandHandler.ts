import { Command } from 'commander';

export interface ICommandHandler {
  registerCommands(program: Command): void;
}
