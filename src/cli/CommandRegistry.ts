import { Command } from 'commander';
import { ICommandHandler } from './interfaces/ICommandHandler';

export class CommandRegistry {
  private handlers: ICommandHandler[] = [];

  public addHandler(handler: ICommandHandler): void {
    this.handlers.push(handler);
  }

  public registerAll(program: Command): void {
    this.handlers.forEach(handler => handler.registerCommands(program));
  }
}
