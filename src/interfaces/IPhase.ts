import { ITask } from './ITask';

export interface IPhase {
  name: string;
  executed: boolean;
  tasks: ITask[];
}
