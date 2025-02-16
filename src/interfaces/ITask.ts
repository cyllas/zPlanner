export interface ITask {
  id: string;
  name: string;
  executed: boolean;
  subtasks?: ITask[];
  parentId?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
