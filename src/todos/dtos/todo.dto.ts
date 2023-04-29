import { TodoStatus } from '../types/todoStatusType';

export interface TodoDTO {
  id: number;
  title: string;
  status: TodoStatus;
}
